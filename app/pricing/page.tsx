import Header from '@/components/Header';
import { Check } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50/95 dark:bg-gray-900">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        More workout generation<br />for the true enthusiasts
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Continues as an indivdual, but if you are true believer then upgrade for more.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Individual Plan */}
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8 backdrop-blur-sm relative">
                        <h3 className="text-lg font-semibold mb-4">Individuals</h3>
                        <div className="mb-4">
                            <p className="text-4xl font-bold">$0</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per month/user</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Good for individuals who are just starting out and simply want the essentials.
                        </p>
                        <button className="w-full py-4 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 mb-8">
                            Get started
                        </button>
                        <div>
                            <p className="font-medium mb-4">Free, forever</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">10 workouts per day</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">1 user per workout</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">5 saved workouts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Workflows</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Integrate with your favorite apps</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">24/7 Support</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Teams Plan */}
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8 backdrop-blur-sm relative">
                        <h3 className="text-lg font-semibold mb-4">Pro</h3>
                        <div className="mb-4">
                            <p className="text-4xl font-bold">$5</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per month/user</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Highly recommended for small teams who seek to upgrade their time & perform.
                        </p>
                        <button className="w-full py-4 px-4 rounded-lg bg-[#0fa579] text-white text-sm font-medium mb-8">
                            Get started
                        </button>
                        <div>
                            <p className="font-medium mb-4">Free plan features, plus:</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">1 team</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Schedule meetings as a team</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Round-Robin, Fixed Round-Robin</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Collective Events</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Advanced Routing Forms</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Team Workflows</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-8 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold mb-4">Teams</h3>
                        <div className="mb-4">
                            <p className="text-4xl font-bold">$20</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">per year</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Robust scheduling for larger teams looking to have more control, privacy & security.
                        </p>
                        <button className="w-full py-4 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 mb-8">
                            Contact us
                        </button>
                        <div>
                            <p className="font-medium mb-4">Organization plan features, plus:</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">1 parent team and unlimited sub-teams</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Organization workflows</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Insights - analyze your booking data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Active directory sync</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">24/7 Email, Chat and Phone support</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">Sync your HRIS tools</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 