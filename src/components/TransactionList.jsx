import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const TransactionList = () => {
    const { transactions, deleteTransaction } = useContext(TransactionContext);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>

            {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    No transactions yet. Add one to get started!
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {transaction.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{transaction.description}</p>
                                    <p className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(transaction.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;
