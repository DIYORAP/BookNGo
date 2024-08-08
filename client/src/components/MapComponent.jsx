import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = "pk.eyJ1IjoicGFydGhpazEwMDAiLCJhIjoiY2x3dGdiN3VoMDM4eDJsczdnMzF6ZDEwMiJ9._0J8bPx46q5D5zgnIpd4DQ";

const MapComponent = ({ location }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  console.log(location);
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        if (data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates([lng, lat]);
          setError(null);
        } else {
          setError('No results found');
        }
      } catch (error) {
        setError('Error fetching coordinates');
        console.error('Error:', error);
      }
    };

    if (location) {
      fetchCoordinates();
    }
  }, [location]);

  useEffect(() => {
    if (coordinates) {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: coordinates,
        zoom: 9,
      });

      new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML("<p> Exact location will be provided after booking</P>")
            .setMaxWidth("300px")
        )
        .addTo(map);

      return () => map.remove();
    }
  }, [coordinates]);

  return (
    <>
      {error && <p>{error}</p>}
      <div id="map" style={{ height: '400px', width: '80vh' }} />
    </>
  );
};

export default MapComponent;
