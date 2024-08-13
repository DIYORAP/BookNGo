import { Link } from "react-router-dom";


export default function EventCard({ events }) {
    return (

        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Learn how to grow your business with our expert advice.
                    </p>
                </div>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {events.map((event) => (
                        <Link key={event._id} to={`api/event/show/${event._id}`} className="block mb-8">

                            <article key={event.id} className="flex max-w-xl flex-col items-start justify-between">
                                <div className="items-center gap-x-4 text-xs">
                                    <div className="h[259px]">
                                        <img className="rounded-t-lg mb-3" src={event.imageUrls || "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"} />
                                    </div>
                                    <time dateTime={event.date} className="text-gray-500">
                                        {event.date}
                                    </time>
                                    <a
                                        href={event.category}
                                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                    >
                                        {event.category}
                                    </a>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                        <a href={event.href}>
                                            <span className="absolute inset-0" />
                                            {event.title}
                                        </a>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{event.description}</p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    <img alt="" src={event.imageUrls} className="h-10 w-10 rounded-full bg-gray-50" />
                                    <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                            <a>
                                                <span className="absolute inset-0" />
                                                Parthik
                                            </a>
                                        </p>
                                        <p className="text-gray-600">programmer</p>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
