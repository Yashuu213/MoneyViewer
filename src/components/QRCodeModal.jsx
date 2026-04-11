import React, { useContext } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Download, Share2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionContext } from '../context/TransactionContext';

const QRCodeModal = ({ isOpen, onClose, amount, name, vpa, description }) => {
    const { clearPersonDebts } = useContext(TransactionContext);
    const [copied, setCopied] = React.useState(false);

    // Official UPI URI format: upi://pay?pa=address&pn=name&am=amount&tn=note
    const upiLink = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(description || 'Split via Hisaab.AI')}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(upiLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSettle = async () => {
        await clearPersonDebts(name);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="pro-card w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Settlement Request</h3>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="text-center">
                        <div className="mb-8 p-3 bg-white dark:bg-slate-50 rounded-2xl inline-block shadow-sm border border-slate-100">
                            <QRCodeSVG value={upiLink} size={180} level="H" includeMargin={false} />
                        </div>

                        <div className="space-y-1 mb-8">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Settlement Total</p>
                            <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">₹{amount.toLocaleString()}</p>
                            <p className="text-sm font-medium text-indigo-600 truncate px-4">Recieving from: {name}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-800"
                                >
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'UPI Link'}
                                </button>
                                <button className="px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
                                    <Share2 size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleSettle}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
                            >
                                <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
                                Done & Settle Account
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                                Hisaab.AI secured Settlement • Automated Ledger Sync
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QRCodeModal;
