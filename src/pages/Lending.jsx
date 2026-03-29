import React, { useState, useContext, useRef, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { UserPlus, ArrowDownCircle, ArrowUpCircle, ChevronDown, ChevronUp, Search, X, User, QrCode, Settings, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
                className={`w-full p-3 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'ring-2 ring-blue-500 border-transparent shadow-md' : 'border-gray-200 hover:border-blue-400'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {value ? (
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {value.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                        <Search className="w-4 h-4 text-gray-400 ml-2" />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="w-full p-2 bg-transparent text-sm outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[240px] overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.name}
                                    onClick={() => {
                                        onChange(opt.name);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors border-l-2 border-transparent hover:border-blue-500"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                                        {opt.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{opt.name}</p>
                                        <p className="text-xs text-gray-400">Balance: ₹{opt.balance.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm text-gray-500 mb-3 italic">No one found with that name.</p>
                            </div>
                        )}
                    </div>
                    <div
                        onClick={() => {
                            onChange('ADD_NEW');
                            setIsOpen(false);
                            setSearch('');
                        }}
                        className="p-3 bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center gap-3 text-blue-600 font-semibold border-t border-blue-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <UserPlus className="w-4 h-4" />
                        </div>
                        <span>+ Add New Person</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const CollectModal = ({ isOpen, onClose, name, amount, vpa }) => {
    if (!isOpen) return null;

    const upiUrl = `upi://pay?pa=${vpa}&pn=MoneyViewer&am=${Math.abs(amount).toFixed(2)}&cu=INR&tn=SettleUp`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-400" />
                </button>

                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900">Collect Money</h3>
                        <p className="text-gray-500 font-medium">Ask {name} to scan and pay</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border-4 border-blue-50 inline-block shadow-inner">
                        <QRCodeSVG value={upiUrl} size={200} />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-blue-600">₹{Math.abs(amount).toFixed(2)}</p>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Requesting via UPI</p>
                    </div>

                    <div className="pt-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Your VPA: {vpa}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Lending = () => {
    const { debts, addDebt, deleteDebt, getPeopleBalances, vpa, updateVpa } = useContext(TransactionContext);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('lent');
    const [isNewPerson, setIsNewPerson] = useState(false);
    const [expandedPerson, setExpandedPerson] = useState(null);
    
    // QR / VPA States
    const [showCollect, setShowCollect] = useState(false);
    const [collectDetails, setCollectDetails] = useState({ name: '', amount: 0 });
    const [isEditingVpa, setIsEditingVpa] = useState(false);
    const [tempVpa, setTempVpa] = useState(vpa);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !amount) return;

        addDebt({
            name,
            amount: parseFloat(amount),
            type,
        });

        setName('');
        setAmount('');
        setIsNewPerson(false);
    };

    const peopleBalances = getPeopleBalances();

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header / Intro */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Split Bills</h1>
                    <p className="text-gray-500">Track who owes you and who you owe.</p>
                </div>
                
                {/* VPA Settings Inline */}
                <div className="flex items-center gap-2">
                    {isEditingVpa ? (
                        <div className="flex items-center gap-2 bg-white p-1 pr-3 rounded-full border shadow-sm animate-in slide-in-from-right-4">
                            <input 
                                type="text"
                                value={tempVpa}
                                onChange={(e) => setTempVpa(e.target.value)}
                                placeholder="name@upi"
                                className="pl-3 py-1.5 text-sm outline-none w-32 font-medium"
                                autoFocus
                            />
                            <button 
                                onClick={() => {
                                    updateVpa(tempVpa);
                                    setIsEditingVpa(false);
                                }}
                                className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditingVpa(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${vpa ? 'bg-white border text-gray-600 hover:border-blue-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            <Settings className="w-4 h-4" />
                            {vpa ? 'UPI: ' + vpa : 'Setup UPI ID'}
                        </button>
                    )}
                </div>
            </div>

            {/* Collect Modal */}
            <CollectModal 
                isOpen={showCollect}
                onClose={() => setShowCollect(false)}
                name={collectDetails.name}
                amount={collectDetails.amount}
                vpa={vpa}
            />

            {/* Summary Cards with Gradients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)] transform hover:scale-[1.02] transition-all duration-300">
                    <h3 className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-2">To Receive</h3>
                    <p className="text-3xl sm:text-4xl font-black tracking-tight">
                        ₹{peopleBalances.filter(p => p.balance > 0).reduce((sum, p) => sum + p.balance, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-[0_10px_30px_-5px_rgba(244,63,94,0.3)] transform hover:scale-[1.02] transition-all duration-300">
                    <h3 className="text-rose-100 font-bold uppercase tracking-widest text-xs mb-2">To Pay</h3>
                    <p className="text-3xl sm:text-4xl font-black tracking-tight">
                        ₹{Math.abs(peopleBalances.filter(p => p.balance < 0).reduce((sum, p) => sum + p.balance, 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Modern Form */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors duration-500 opacity-20" />
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <ArrowUpCircle className="w-5 h-5" />
                        </div>
                        Add Transaction
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="p-1.5 bg-gray-100 rounded-2xl grid grid-cols-2 gap-1">
                            <button
                                type="button"
                                onClick={() => setType('lent')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-[1.25rem] font-bold text-xs uppercase tracking-wider transition-all duration-300 ${type === 'lent'
                                    ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-500/20'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <ArrowUpCircle className="w-4 h-4" />
                                I Paid
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('borrowed')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-[1.25rem] font-bold text-xs uppercase tracking-wider transition-all duration-300 ${type === 'borrowed'
                                    ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-500/20'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <ArrowDownCircle className="w-4 h-4" />
                                They Paid
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">SPLIT WITH</label>
                            {isNewPerson ? (
                                <div className="animate-in zoom-in-95 duration-200">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1 group">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter full name"
                                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                                autoFocus
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsNewPerson(false);
                                                setName('');
                                            }}
                                            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <SearchableSelect
                                    options={peopleBalances}
                                    value={name}
                                    onChange={(val) => {
                                        if (val === 'ADD_NEW') {
                                            setIsNewPerson(true);
                                            setName('');
                                        } else {
                                            setName(val);
                                        }
                                    }}
                                    placeholder="Select a person"
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">AMOUNT</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl group-focus-within:text-blue-500 transition-colors">₹</div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full p-4 pl-10 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xl text-gray-900"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Add Transaction
                        </button>
                    </form>
                </div>

                {/* Right: People Cards */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-gray-900">Connections</h2>
                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">{peopleBalances.length} People</span>
                    </div>

                    {peopleBalances.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-medium">No split expenses yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                            {peopleBalances.map((person) => (
                                <div
                                    key={person.name}
                                    className={`bg-white rounded-[2rem] transition-all duration-300 border-2 ${expandedPerson === person.name ? 'border-blue-500/30 ring-4 ring-blue-50 shadow-xl' : 'border-gray-50 hover:border-gray-100 hover:shadow-lg'
                                        }`}
                                >
                                    <div
                                        className="p-6 flex items-center justify-between cursor-pointer"
                                        onClick={() => setExpandedPerson(expandedPerson === person.name ? null : person.name)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg ${person.balance > 0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : person.balance < 0 ? 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/30' : 'bg-gray-400'
                                                }`}>
                                                {person.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-gray-900">{person.name}</p>
                                                <p className="text-sm font-medium text-gray-500">
                                                    {person.balance > 0 ? 'Owes you' : person.balance < 0 ? 'You owe' : 'Settled up'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div className="flex flex-col items-end mr-2">
                                                <span className={`text-xl font-black tracking-tight ${person.balance > 0 ? 'text-emerald-600' : person.balance < 0 ? 'text-rose-600' : 'text-gray-400'
                                                    }`}>
                                                    {person.balance > 0 ? '+' : ''}₹{Math.abs(person.balance).toFixed(2)}
                                                </span>
                                                {person.balance > 0 && vpa && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCollectDetails({ name: person.name, amount: person.balance });
                                                            setShowCollect(true);
                                                        }}
                                                        className="flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 mt-1 tracking-widest bg-blue-50 px-2 py-0.5 rounded-full"
                                                    >
                                                        <QrCode className="w-3 h-3" />
                                                        Collect
                                                    </button>
                                                )}
                                            </div>
                                            {expandedPerson === person.name ? (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
                                                    <ChevronUp className="w-5 h-5 text-gray-600" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {expandedPerson === person.name && (
                                        <div className="bg-gray-50/50 p-6 pt-0 border-t border-gray-100/50">
                                            <div className="space-y-3 mt-6">
                                                {person.transactions.map((txn, idx) => (
                                                    <div key={txn.id} className="group flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-100">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-2 rounded-xl ${txn.type === 'lent' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                                                {txn.type === 'lent' ? (
                                                                    <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
                                                                ) : (
                                                                    <ArrowDownCircle className="w-6 h-6 text-rose-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{txn.type === 'lent' ? 'You paid' : 'They paid'}</p>
                                                                <p className="text-xs font-bold text-gray-400 uppercase">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className={`text-lg font-black ${txn.type === 'lent' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {txn.type === 'lent' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteDebt(txn.id);
                                                                }}
                                                                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center group-hover:opacity-100 opacity-0"
                                                            >
                                                                <X className="w-5 h-5" />
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
