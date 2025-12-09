export default function Dashboard() {
    // Mock data - will be replaced with API calls
    const userInfo = {
        username: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+64 21 123 4567',
        fullName: 'John Doe',
        memberLevel: 'Gold',
        points: 1250,
    };

    const recentActivities = [
        { id: 1, type: 'Event Registration', description: 'Registered for Winter Tournament', date: '2025-01-10', points: '+50' },
        { id: 2, type: 'Purchase', description: 'Bought Pool Cue', date: '2025-01-08', points: '-200' },
        { id: 3, type: 'Event Participation', description: 'Completed Spring League', date: '2025-01-05', points: '+100' },
    ];

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">My Dashboard</h1>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Member Level</h3>
                        <p className="text-2xl font-bold text-primary">{userInfo.memberLevel}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Points Balance</h3>
                        <p className="text-2xl font-bold text-gray-900">{userInfo.points.toLocaleString()}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                        <p className="text-lg font-semibold text-gray-900">{userInfo.email}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                        <p className="text-lg font-semibold text-gray-900">{userInfo.phone}</p>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <p className="text-gray-900">{userInfo.fullName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <p className="text-gray-900">{userInfo.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <p className="text-gray-900">{userInfo.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <p className="text-gray-900">{userInfo.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Activity History */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">{activity.type}</h3>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                                </div>
                                <div className={`text-lg font-bold ${activity.points.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {activity.points}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

