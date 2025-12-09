import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Golden9</h3>
                        <p className="text-gray-600 text-sm">
                            New Zealand's premier cue sports club. Established to provide a family-friendly,
                            inclusive atmosphere for players of all ages and stages.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-primary text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-600 hover:text-primary text-sm">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-gray-600 hover:text-primary text-sm">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link to="/membership" className="text-gray-600 hover:text-primary text-sm">
                                    Membership
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Email: info@golden9.co.nz</p>
                            <p>Phone: +64 7 123 4567</p>
                            <div className="mt-4">
                                <p className="font-semibold mb-2">Follow Us</p>
                                <div className="flex space-x-4">
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-primary"
                                    >
                                        Facebook
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                    <p>Copyright © {new Date().getFullYear()} Golden9. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

