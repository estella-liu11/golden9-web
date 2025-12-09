import { Link } from 'react-router-dom';

export default function Membership() {
    const membershipTiers = [
        {
            name: 'Bronze',
            price: 49,
            duration: 'month',
            features: [
                'Access to club facilities',
                '10% discount on events',
                'Basic member support',
                'Points earning program',
            ],
            color: 'border-orange-300',
            buttonColor: 'bg-orange-600 hover:bg-orange-700',
        },
        {
            name: 'Silver',
            price: 89,
            duration: 'month',
            features: [
                'All Bronze benefits',
                '20% discount on events',
                'Priority event registration',
                'Enhanced points earning',
                'Monthly coaching session',
            ],
            color: 'border-gray-400',
            buttonColor: 'bg-gray-600 hover:bg-gray-700',
            popular: true,
        },
        {
            name: 'Gold',
            price: 149,
            duration: 'month',
            features: [
                'All Silver benefits',
                '30% discount on events',
                'VIP event access',
                'Maximum points earning',
                'Weekly coaching sessions',
                'Exclusive merchandise',
                'Priority customer support',
            ],
            color: 'border-yellow-400',
            buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        },
    ];

    const handleSubscribe = (tier) => {
        // TODO: Implement subscription logic with API call
        alert(`Subscription for ${tier} membership will be implemented with API integration`);
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Membership Plans</h1>
                    <p className="text-xl text-gray-600">
                        Choose the membership tier that best fits your needs. All plans include access to our facilities and events.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {membershipTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative bg-white border-2 rounded-lg shadow-lg overflow-hidden ${tier.popular ? tier.color : 'border-gray-200'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{tier.name}</h2>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                                    <span className="text-gray-600">/{tier.duration}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSubscribe(tier.name)}
                                    className={`w-full py-3 text-white rounded-lg font-semibold transition-colors ${tier.buttonColor}`}
                                >
                                    Subscribe Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Already a Member?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Log in to your account to manage your membership, view your benefits, and renew your subscription.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                        Log In to Your Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

