import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { LayoutDashboard, PieChart, Wallet, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useContext(TransactionContext);

    const isActive = (path) => location.pathname === path;

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

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center gap-6">
                        <Link to="/" className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}>
                            Dashboard
                        </Link>
                        <Link to="/analysis" className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive('/analysis') ? 'text-blue-600' : 'text-gray-600'}`}>
                            Analysis
                        </Link>
                        <Link to="/lending" className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive('/lending') ? 'text-blue-600' : 'text-gray-600'}`}>
                            Lending
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            Hello, <strong>{user?.username}</strong>
                        </span>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full pb-safe sm:hidden">
                <div className="flex justify-around items-center h-16">
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="text-xs font-medium">Dashboard</span>
                    </Link>
                    <Link
                        to="/analysis"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/analysis') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <PieChart className="w-6 h-6" />
                        <span className="text-xs font-medium">Analysis</span>
                    </Link>
                    <Link
                        to="/lending"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/lending') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <Wallet className="w-6 h-6" />
                        <span className="text-xs font-medium">Lending</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
