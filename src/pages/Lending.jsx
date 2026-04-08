import React, { useState, useContext, useRef, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { UserPlus, ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp, Search, X, User, QrCode, Settings, Check, Wallet, Hash, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCodeModal from '../components/QRCodeModal';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`pro-input flex items-center justify-between cursor-pointer ${isOpen ? 'ring-2 ring-indigo-500/20' : ''}`}
            >
                <div className="flex items-center gap-2">
                    {value ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                {value.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{value}</span>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-sm">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 w-full mt-2 pro-card overflow-hidden shadow-xl"
                    >
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                            <Search className="w-3 h-3 text-slate-400 ml-2" />
                            <input
                                type="text"
                                placeholder="Filter people..."
                                className="w-full py-2 bg-transparent text-xs outline-none font-medium text-slate-600 dark:text-slate-300"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[240px] overflow-y-auto p-1 space-y-0.5">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.name}
                                        onClick={() => {
                                            onChange(opt.name);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer flex items-center justify-between transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {opt.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{opt.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                    Current Stake
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xs font-bold ${opt.balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                ₹{Math.abs(opt.balance).toLocaleString()}
                                            </p>
                                            <p className="text-[8px] text-slate-400 uppercase font-black">{opt.balance >= 0 ? 'Receivable' : 'Payable'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-xs font-bold text-slate-400">Registry Entry Missing</p>
                                </div>
                            )}
                        </div>
                        <div
                            onClick={() => {
                                onChange('ADD_NEW');
                                setIsOpen(false);
                                setSearch('');
                            }}
                            className="p-3 bg-indigo-600/5 text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            <UserPlus className="w-3 h-3" />
                            <span>New Entity</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Lending = () => {
    const { debts, addDebt, deleteDebt, getPeopleBalances, vpa, updateVpa } = useContext(TransactionContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('lent');
    const [isNewPerson, setIsNewPerson] = useState(false);
    const [expandedPerson, setExpandedPerson] = useState(null);
    
    const [showCollect, setShowCollect] = useState(false);
    const [collectDetails, setCollectDetails] = useState({ name: '', amount: 0, description: '' });
    const [isEditingVpa, setIsEditingVpa] = useState(false);
    const [tempVpa, setTempVpa] = useState(vpa);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        addDebt({
            name,
            amount: parseFloat(amount),
            type,
            description,
            date: new Date().toISOString(),
        });

        setName('');
        setAmount('');
        setDescription('');
        setIsNewPerson(false);
    };

    const peopleBalances = getPeopleBalances();

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Professional Breadcrumb/Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest">PRO LEDGER</span>
                        <span className="text-[10px] font-bold text-slate-400">/ SYSTEM_SETTLEMENT</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Split Accounts</h1>
                    <p className="text-sm text-slate-500 font-medium">Track inter-party receivables and system liabilities.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {isEditingVpa ? (
                        <div className="flex items-center gap-2 pro-card p-1 shadow-sm">
                            <input 
                                type="text"
                                value={tempVpa}
                                onChange={(e) => setTempVpa(e.target.value)}
                                placeholder="name@upi"
                                className="pl-3 py-1.5 bg-transparent outline-none w-36 text-xs font-bold dark:text-white"
                                autoFocus
                            />
                            <button 
                                onClick={() => {
                                    updateVpa(tempVpa);
                                    setIsEditingVpa(false);
                                }}
                                className="bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-500 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditingVpa(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-indigo-500/50 transition-all shadow-sm"
                        >
                            <Settings size={14} className="text-indigo-500" />
                            {vpa ? vpa : 'Configure UPI Gateway'}
                        </button>
                    )}
                </div>
            </div>

            <QRCodeModal 
                isOpen={showCollect}
                onClose={() => setShowCollect(false)}
                name={collectDetails.name}
                amount={collectDetails.amount}
                vpa={vpa}
                description={collectDetails.description}
            />

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="pro-card p-8 bg-slate-900 border-slate-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                    <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] mb-6">Aggregate Receivable</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight">₹{peopleBalances.filter(p => p.balance > 0).reduce((sum, p) => sum + p.balance, 0).toLocaleString('en-IN')}</span>
                        <span className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">Receivable</span>
                    </div>
                </div>
                
                <div className="pro-card p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                    <h3 className="text-rose-500 font-bold uppercase tracking-widest text-[9px] mb-6">Total Liabilities</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">₹{Math.abs(peopleBalances.filter(p => p.balance < 0).reduce((sum, p) => sum + p.balance, 0)).toLocaleString('en-IN')}</span>
                        <span className="text-rose-500/60 text-[10px] font-bold uppercase tracking-widest">Payable</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 pb-20 md:pb-0">
                {/* Entry Interface */}
                <div className="lg:col-span-12 xl:col-span-4 h-fit">
                    <div className="pro-card p-6 md:p-8 xl:sticky xl:top-24">
                        <div className="flex items-center gap-2 mb-8">
                            <UserPlus size={16} className="text-indigo-500" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Log New Split</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full">
                                <button
                                    type="button"
                                    onClick={() => setType('lent')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'lent' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600' : 'text-slate-400'}`}
                                >
                                    I Paid
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('borrowed')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${type === 'borrowed' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600' : 'text-slate-400'}`}
                                >
                                    They Paid
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Counter-Party</label>
                                {isNewPerson ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Legal Name"
                                            className="pro-input flex-1"
                                            autoFocus required
                                        />
                                        <button onClick={() => setIsNewPerson(false)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <SearchableSelect
                                        options={peopleBalances}
                                        value={name}
                                        onChange={(val) => val === 'ADD_NEW' ? setIsNewPerson(true) : setName(val)}
                                        placeholder="Select entity..."
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Volume (₹)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="pro-input font-bold"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Memo</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Reason for split..."
                                        className="pro-input"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-widest shadow-indigo-500/10 mt-2">
                                Commit Entry
                            </button>
                        </form>
                    </div>
                </div>

                {/* Registry View */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Registry Overview</h2>
                        <span className="text-[10px] font-mono text-slate-400 tracking-tighter">{peopleBalances.length} ACTIVE LEDGERS</span>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {peopleBalances.map((person) => (
                                <motion.div
                                    key={person.name}
                                    layout
                                    className={`pro-card border transition-all overflow-hidden ${expandedPerson === person.name ? 'border-indigo-500/30 ring-4 ring-indigo-500/5' : 'border-slate-100 dark:border-slate-800'}`}
                                >
                                    <div
                                        className="p-5 flex items-center justify-between cursor-pointer group"
                                        onClick={() => setExpandedPerson(expandedPerson === person.name ? null : person.name)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105 ${
                                                person.balance > 0 ? 'bg-slate-900 shadow-slate-950/20' : 
                                                person.balance < 0 ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                                {person.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{person.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${person.balance >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'}`}>
                                                        {person.balance > 0 ? 'To Receive' : person.balance < 0 ? 'Payable' : 'Settled'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className={`text-lg font-bold tracking-tight font-mono ${person.balance > 0 ? 'text-emerald-500' : person.balance < 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                                                    {person.balance > 0 ? '+' : ''}₹{Math.abs(person.balance).toLocaleString()}
                                                </p>
                                                {person.balance > 0 && vpa && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCollectDetails({ name: person.name, amount: person.balance, description: 'Settle-up' });
                                                            setShowCollect(true);
                                                        }}
                                                        className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-indigo-600 dark:text-indigo-400 mt-1 hover:text-indigo-500 transition-colors"
                                                    >
                                                        <QrCode size={10} /> Instant Invoice
                                                    </button>
                                                )}
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-all">
                                                {expandedPerson === person.name ? <ChevronUp size={16} /> : <ChevronDown size={14} />}
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedPerson === person.name && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20"
                                            >
                                                <div className="p-4 space-y-2">
                                                    {person.transactions.map((txn) => (
                                                        <div key={txn.id} className="group flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-1.5 rounded-lg ${txn.type === 'lent' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'}`}>
                                                                    {txn.type === 'lent' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{txn.type === 'lent' ? 'You Settled/Paid' : 'They Paid'}</p>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tabular-nums">
                                                                        {new Date(txn.date).toLocaleDateString('en-GB')} {txn.description && ` // ${txn.description}`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <p className={`text-xs font-bold font-mono ${txn.type === 'lent' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                                    ₹{txn.amount.toLocaleString()}
                                                                </p>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); deleteDebt(txn.id); }}
                                                                    className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lending;
