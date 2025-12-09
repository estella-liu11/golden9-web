import { useState } from 'react';

export default function Events() {
    // Mock data - will be replaced with API calls
    const [events] = useState([
        {
            id: 1,
            title: 'Winter Championship 2025',
            date: '2025-02-15',
            fee: 50,
            description: 'Join us for our annual winter championship tournament. Open to all skill levels.',
            status: 'open',
        },
        {
            id: 2,
            title: 'Spring League Tournament',
            date: '2025-03-20',
            fee: 75,
            description: 'Competitive league tournament with prizes for top performers.',
            status: 'open',
        },
        {
            id: 3,
            title: 'Beginner Friendly Tournament',
            date: '2025-02-01',
            fee: 30,
            description: 'Perfect for new players looking to experience tournament play.',
            status: 'open',
        },
    ]);

    const handleRegister = (eventId) => {
        // TODO: Implement registration logic with API call
        alert(`Registration for event ${eventId} will be implemented with API integration`);
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === 'open'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {event.status === 'open' ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString('en-NZ', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        <span className="font-semibold">Entry Fee:</span> ${event.fee}
                                    </p>
                                    <p className="text-gray-700">{event.description}</p>
                                </div>
                                <button
                                    onClick={() => handleRegister(event.id)}
                                    className="w-full mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    disabled={event.status !== 'open'}
                                >
                                    Register Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No events available at the moment.</p>
                        <p className="text-gray-500 mt-2">Check back soon for upcoming tournaments!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

