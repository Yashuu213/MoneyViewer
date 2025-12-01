import React from 'react';
import { LayoutDashboard, PieChart, Wallet } from 'lucide-react';

const Layout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">MoneyTracker</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full pb-safe">
                <div className="flex justify-around items-center h-16">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="text-xs font-medium">Dashboard</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'analysis' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <PieChart className="w-6 h-6" />
                        <span className="text-xs font-medium">Analysis</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('lending')}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'lending' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Wallet className="w-6 h-6" />
                        <span className="text-xs font-medium">Lending</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
