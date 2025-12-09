import { Link } from 'react-router-dom';

export default function Home() {
    const announcements = [
        {
            id: 1,
            title: 'New Tournament Season Starting',
            date: '2025-01-15',
            content: 'Join us for our exciting new tournament season. Registration opens next week!',
        },
        {
            id: 2,
            title: 'Membership Benefits Updated',
            date: '2025-01-10',
            content: 'We\'ve enhanced our membership benefits with new perks and exclusive access.',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Golden9, New Zealand's Premier Cue Sports Club
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Established to provide a family-friendly, inclusive atmosphere for players of all ages and stages.
                            Join our community and experience the best in cue sports.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/membership"
                                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Become a Member
                            </Link>
                            <Link
                                to="/events"
                                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                            >
                                View Events
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Choose Golden9?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-gray-50">
                            <div className="text-4xl mb-4">🎱</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Facilities</h3>
                            <p className="text-gray-600">
                                State-of-the-art tables and equipment for the best playing experience.
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-gray-50">
                            <div className="text-4xl mb-4">🏆</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tournament Play</h3>
                            <p className="text-gray-600">
                                Regular tournaments and competitions for players of all skill levels.
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-gray-50">
                            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Friendly</h3>
                            <p className="text-gray-600">
                                A welcoming environment for players of all ages and backgrounds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Announcements Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Latest News & Announcements
                    </h2>
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {announcement.title}
                                    </h3>
                                    <span className="text-sm text-gray-500">{announcement.date}</span>
                                </div>
                                <p className="text-gray-600">{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Join Us?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Start your journey with Golden9 today and become part of New Zealand's premier cue sports community.
                    </p>
                    <Link
                        to="/membership"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                        Explore Membership Options
                    </Link>
                </div>
            </section>
        </div>
    );
}

