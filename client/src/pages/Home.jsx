import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import EventCard from "./card/EventCard";
export default function EventList() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/event/show"); // Adjust the endpoint to fetch all events
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data); // Update state with fetched data
                } else {
                    console.error('Failed to fetch events');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    if (!events.length) return <p>Loading...</p>;

    return (



        <EventCard events={events} />
    );
}
