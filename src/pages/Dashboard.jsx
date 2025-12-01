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
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-blue-100 font-medium">Total Balance</h3>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Income</h3>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">+${income.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Expenses</h3>
                        <div className="bg-red-100 p-2 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">-${expense.toFixed(2)}</p>
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
