import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import MagicAIInput from '../components/MagicAIInput';
import { Wallet, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Section: Command & History */}
            <div className="lg:col-span-8 space-y-6">
                {/* Command Bar Section - PRIMARY ACCESS */}
                <div className="pro-card p-1 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <MagicAIInput />
                </div>

                {/* Master Balance Hero - Upgraded Precision Layout */}
                <div className="pro-card bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-800 p-6 md:p-8 relative overflow-hidden shadow-sm border-l-4 border-l-indigo-600">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl opacity-50" />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                        {/* Main Balance */}
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[9px] mb-3">
                                <Wallet className="w-3.5 h-3.5" />
                                Net Liquidity
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">₹{balance.toLocaleString('en-IN')}</p>
                                <span className={`text-xs font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {balance >= 0 ? '↑' : '↓'}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-3 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" /> Prime Assets
                            </p>
                        </div>

                        {/* Side-by-Side Pods */}
                        <div className="flex border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-8 lg:pt-0 lg:pl-10 flex-1 gap-4">
                            {/* Incoming Pod */}
                            <div className="flex-1 min-w-[140px] p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100/50 dark:border-emerald-500/20 group hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-[8px] mb-3">
                                    <TrendingUp className="w-3 h-3" />
                                    Incoming
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">₹{income.toLocaleString('en-IN')}</p>
                                    <p className="text-[8px] font-bold text-emerald-600/60 dark:text-emerald-400/60 transition-opacity">CASH INFLOW</p>
                                </div>
                            </div>

                            {/* Outgoing Pod */}
                            <div className="flex-1 min-w-[140px] p-5 rounded-3xl bg-rose-50/60 dark:bg-rose-500/10 border border-rose-100/50 dark:border-rose-500/20 group hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300">
                                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest text-[8px] mb-3">
                                    <TrendingDown className="w-3 h-3" />
                                    Outgoing
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-rose-600 dark:text-rose-400 tracking-tight">₹{expense.toLocaleString('en-IN')}</p>
                                    <p className="text-[8px] font-bold text-rose-600/60 dark:text-rose-400/60 transition-opacity">CASH OUTFLOW</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legacy Form (Optional/Hidden in Pro) */}
                <div className="pro-card p-6 pro-card-hover min-h-[340px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={16} className="text-indigo-500" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Manual Registry Entry</h2>
                    </div>
                    <TransactionForm />
                </div>

                {/* Transaction List */}
                <div className="pro-card p-6 shadow-sm border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-400">Transaction Registry</h2>
                        <div className="flex gap-2">
                             <span className="px-2 py-1 rounded-md bg-indigo-50 dark:bg-slate-800 text-[10px] font-bold text-indigo-600 dark:text-slate-400">LATEST</span>
                        </div>
                    </div>
                    <TransactionList />
                </div>
            </div>

            {/* Right Section: Intelligence & Stats */}
            <div className="lg:col-span-4 space-y-6">
                {/* Weekly Pulse Widget - Relocated for better hierarchy */}
                <div className="pro-card p-6 bg-white dark:bg-slate-900 border-indigo-50/50 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Weekly Pulse</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                            You've logged <span className="text-indigo-600 font-black">{transactions.length}</span> transactions this week. Reach for the "Command Bar" to add more.
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-400 uppercase tracking-tighter">Total processed</span>
                        <span className="font-mono text-indigo-500">#{transactions.length.toString().padStart(4, '0')}</span>
                    </div>
                </div>

                {/* Pro Tips Side Card */}
                <div className="pro-card p-6 bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-indigo-400/70 uppercase tracking-widest mb-4">Pro Tips</h4>
                    <ul className="space-y-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <li className="flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                            <span>Type "500 rent" to log expenses quickly with AI.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>"1000 salary aai" adds income automatically.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
