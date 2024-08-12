import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

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
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Upcoming Events</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Check out our upcoming events and find something that interests you!
                    </p>
                </div>

                {events.map((event) => (
                    <Link key={event._id} to={`api/event/show/${event._id}`} className="block mb-8">
                        <article className="flex max-w-xl flex-col items-start justify-between">
                            <div className="items-center gap-x-4 text-xs mb-3">
                                {event.imageUrls.map((url, index) => (
                                    <img key={index} className="rounded-t-lg mb-3" src={url} alt={event.title} />
                                ))}
                                <time dateTime={event.date} className="text-gray-500">
                                    {new Date(event.date).toLocaleDateString()} {event.starttime} - {event.endtime}
                                </time>
                                <span
                                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    {event.category}
                                </span>
                            </div>
                            <div className="group relative">
                                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                    {event.title}
                                </h3>
                                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{event.description}</p>
                            </div>
                            <div className="relative mt-8 flex items-center gap-x-4">
                                {/* Placeholder for organizer info; adjust if needed */}
                                <img alt="Organizer" src="https://via.placeholder.com/40" className="h-10 w-10 rounded-full bg-gray-50" />
                                <div className="text-sm leading-6">
                                    <p className="font-semibold text-gray-900">Organizer</p>
                                    <p className="text-gray-600">Event Organizer</p>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
