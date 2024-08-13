import React, { useEffect } from 'react'
import Carousel from './visiteve/Carousel'
import Eveinfo from './visiteve/Eveinfo'
import { useState } from 'react';

function EventVisitor() {
    // const [events, setEvents] = useState([]);

    // useEffect(() => {
    //     const fetchEvents = async () => {
    //         try {
    //             const res = await fetch("/api/event/show/:id");
    //             if (res.ok) {
    //                 const data = await res.json();
    //                 setEvents(data); // 
    //             } else {
    //                 console.error('Failed to fetch events');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching events:', error);
    //         }
    //     };
    //     fetchEvents();
    // }, []);

    return (
        <div>
            <Carousel />
            <Eveinfo />
        </div>
    )
}

export default EventVisitor
