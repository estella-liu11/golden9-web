import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch events from database
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await eventAPI.getAll();
                setEvents(data);
                setError('');
            } catch (err) {
                console.error('Failed to fetch events:', err);
                setError('Failed to load events. Please try again later.');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleRegister = (eventId) => {
        // TODO: Implement registration logic with API call
        alert(`Registration for event ${eventId} will be implemented with API integration`);
    };

    // Helper function to check if event is open for registration
    const isEventOpen = (event) => {
        const now = new Date();
        const registrationDeadline = event.end_time ? new Date(event.end_time) : null;

        // Check if registration deadline has passed
        if (registrationDeadline && now > registrationDeadline) {
            return false;
        }

        return event.status === 'scheduled' || event.status === 'ongoing';
    };

    // Helper function to format status display
    const getStatusDisplay = (status) => {
        if (status === 'scheduled' || status === 'ongoing') {
            return 'Open';
        }
        return 'Closed';
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
                    <p className="text-xl text-gray-600">
                        Join our tournaments and competitions. All skill levels welcome.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Loading events...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => {
                                const isOpen = isEventOpen(event);
                                const statusDisplay = getStatusDisplay(event.status);
                                const eventDate = event.start_time ? new Date(event.start_time) : null;

                                return (
                                    <div
                                        key={event.event_id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isOpen
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {statusDisplay}
                                                </span>
                                            </div>
                                            <div className="mb-4 space-y-4">
                                                {/* Date & Time Information */}
                                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                    {eventDate && (
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3"></div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                                    Event Start Time
                                                                </p>
                                                                <p className="text-gray-900 font-medium">
                                                                    {eventDate.toLocaleDateString('en-NZ', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                    })}
                                                                    {event.start_time && (
                                                                        <span className="text-gray-600 ml-2 font-normal">
                                                                            {eventDate.toLocaleTimeString('en-NZ', {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            })}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {event.end_time && (
                                                        <div className="flex items-start pt-2 border-t border-gray-200">
                                                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3"></div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                                    Registration Deadline
                                                                </p>
                                                                <p className="text-gray-900 font-medium">
                                                                    {new Date(event.end_time).toLocaleDateString('en-NZ', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                    })}
                                                                    <span className="text-gray-600 ml-2 font-normal">
                                                                        {new Date(event.end_time).toLocaleTimeString('en-NZ', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        })}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Event Details */}
                                                <div className="space-y-2">
                                                    {event.location && (
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="font-semibold text-gray-700 mr-2 min-w-[80px]">Location:</span>
                                                            <span>{event.location}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center text-gray-600">
                                                        <span className="font-semibold text-gray-700 mr-2 min-w-[80px]">Entry Fee:</span>
                                                        <span className="text-primary font-semibold">${event.fee || 0}</span>
                                                    </div>
                                                    {event.max_participants && (
                                                        <div className="flex items-center text-gray-600">
                                                            <span className="font-semibold text-gray-700 mr-2 min-w-[80px]">Max Participants:</span>
                                                            <span>{event.max_participants}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {event.description && (
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRegister(event.event_id)}
                                                className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                disabled={!isOpen}
                                            >
                                                Register Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {events.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">No events available at the moment.</p>
                                <p className="text-gray-500 mt-2">Check back soon for upcoming tournaments!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

