import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Analysis = () => {
    const { transactions } = useContext(TransactionContext);

    // Calculate expenses by category
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const pieData = Object.keys(expensesByCategory).map(category => ({
        name: category,
        value: expensesByCategory[category]
    }));

    // Calculate monthly spending (simplified for current year)
    const monthlyData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
            const existing = acc.find(item => item.name === month);
            if (existing) {
                existing.amount += curr.amount;
            } else {
                acc.push({ name: month, amount: curr.amount });
            }
            return acc;
        }, []);

    // Sort months properly (optional, simple sort for now)
    // In a real app, you'd handle date sorting more robustly

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Spending Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
                    <div className="h-80">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No expense data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Spending Trend</h3>
                    <div className="h-80">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No spending data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
