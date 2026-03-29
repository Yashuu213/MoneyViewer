import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
    const { transactions } = useContext(TransactionContext);

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expense;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-blue-100 font-bold uppercase tracking-widest text-xs">Total Balance</h3>
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tight">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Monthly Income</h3>
                        <div className="bg-emerald-100 p-3 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">+₹{income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 transform hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Monthly Expenses</h3>
                        <div className="bg-rose-100 p-3 rounded-2xl">
                            <TrendingDown className="w-6 h-6 text-rose-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">-₹{expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <TransactionForm />
                </div>
                <div className="lg:col-span-2">
                    <TransactionList />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
