import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { PlusCircle, MinusCircle } from 'lucide-react';

const TransactionForm = () => {
    const { addTransaction } = useContext(TransactionContext);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('General');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description) return;

        addTransaction({
            amount: parseFloat(amount),
            description,
            type,
            category,
            date: new Date().toISOString(),
        });

        setAmount('');
        setDescription('');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${type === 'expense'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <MinusCircle className="w-5 h-5" />
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${type === 'income'
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <PlusCircle className="w-5 h-5" />
                        Income
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What was this for?"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="General">General</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Salary">Salary</option>
                        <option value="Investment">Investment</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors shadow-sm"
                >
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
