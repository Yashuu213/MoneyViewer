import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { UserPlus, ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Lending = () => {
    const { debts, addDebt, deleteDebt, getPeopleBalances } = useContext(TransactionContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('lent'); // 'lent' or 'borrowed'
    const [expandedPerson, setExpandedPerson] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        addDebt({
            name,
            amount: parseFloat(amount),
            type, // 'lent' means they owe you, 'borrowed' means you owe them
        });

        setName('');
        setAmount('');
    };

    const peopleBalances = getPeopleBalances();

    return (
        <div className="space-y-6 pb-20">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600 rounded-xl p-4 text-white shadow-lg">
                    <h3 className="text-green-100 font-medium text-sm mb-1">You'll Get</h3>
                    <p className="text-2xl font-bold">
                        ₹{peopleBalances.filter(p => p.balance > 0).reduce((sum, p) => sum + p.balance, 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-red-600 rounded-xl p-4 text-white shadow-lg">
                    <h3 className="text-red-100 font-medium text-sm mb-1">You Owe</h3>
                    <p className="text-2xl font-bold">
                        ₹{Math.abs(peopleBalances.filter(p => p.balance < 0).reduce((sum, p) => sum + p.balance, 0)).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Add Transaction Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Split Expense</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setType('lent')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${type === 'lent'
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <ArrowUpCircle className="w-5 h-5" />
                                I Paid
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('borrowed')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${type === 'borrowed'
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <ArrowDownCircle className="w-5 h-5" />
                                They Paid
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Who did you split with?"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
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
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add Transaction
                        </button>
                    </form>
                </div>

                {/* Right: People Balances */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">People & Balances</h2>
                    </div>

                    {peopleBalances.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No split expenses yet. Add one to get started!
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {peopleBalances.map((person) => (
                                <div key={person.name} className="hover:bg-gray-50 transition-colors">
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer"
                                        onClick={() => setExpandedPerson(expandedPerson === person.name ? null : person.name)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${person.balance > 0 ? 'bg-green-500' : person.balance < 0 ? 'bg-red-500' : 'bg-gray-400'
                                                }`}>
                                                {person.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{person.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {person.balance > 0
                                                        ? `owes you ₹${person.balance.toFixed(2)}`
                                                        : person.balance < 0
                                                            ? `you owe ₹${Math.abs(person.balance).toFixed(2)}`
                                                            : 'settled up'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold text-lg ${person.balance > 0 ? 'text-green-600' : person.balance < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                {person.balance > 0 ? '+' : ''}{person.balance.toFixed(2)}
                                            </span>
                                            {expandedPerson === person.name ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded Transaction History */}
                                    {expandedPerson === person.name && (
                                        <div className="bg-gray-50 px-4 pb-4">
                                            <div className="space-y-2">
                                                {person.transactions.map((txn) => (
                                                    <div key={txn.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            {txn.type === 'lent' ? (
                                                                <ArrowUpCircle className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <ArrowDownCircle className="w-4 h-4 text-red-600" />
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {txn.type === 'lent' ? 'You paid' : 'They paid'}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-sm font-semibold ${txn.type === 'lent' ? 'text-green-600' : 'text-red-600'
                                                                }`}>
                                                                {txn.type === 'lent' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteDebt(txn.id);
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 text-xs"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lending;
