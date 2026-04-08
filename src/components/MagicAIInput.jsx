import React, { useState, useEffect, useContext, useRef } from 'react';
import { Mic, MicOff, Sparkles, Send, X, Check, Loader2, ArrowRight } from 'lucide-react';
import { TransactionContext } from '../context/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';

const MagicAIInput = () => {
    const { addBulkItems } = useContext(TransactionContext);
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [parsedItems, setParsedItems] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const isListeningRef = useRef(isListening);

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Keep listening for punctuation
            recognitionRef.current.interimResults = true; // Show text as you speak
            recognitionRef.current.lang = 'en-IN'; // Optimized for Indian accents and Romanized Hinglish

            recognitionRef.current.onresult = (event) => {
                // Clear existing silence timer
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                const currentText = finalTranscript || interimTranscript;
                if (currentText) {
                    setText(currentText);

                    // Start silence timer to auto-submit
                    silenceTimerRef.current = setTimeout(() => {
                        if (isListeningRef.current) {
                            recognitionRef.current.stop();
                            handleParse(currentText);
                        }
                    }, 1800); // 1.8 seconds of silence to auto-parse
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        } else {
            alert("Speech recognition not supported in this browser.");
        }
    };

    const handleParse = async (inputOverride) => {
        const query = inputOverride || text;
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/ai_parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: query })
            });
            const data = await res.json();
            setParsedItems(data);
            setShowPreview(true);
        } catch (err) {
            console.error("Parse failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        await addBulkItems(parsedItems);
        setIsLoading(false);
        setParsedItems([]);
        setShowPreview(false);
        setText('');
    };

    return (
        <div className={`w-full relative transition-all duration-300 rounded-2xl border ${isListening ? 'border-red-400 bg-red-50/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-100 dark:border-slate-800'}`}>
            <div className="flex items-center gap-3 px-4 py-1">
                <div className="flex-shrink-0">
                    <Sparkles size={16} className={isLoading ? "animate-pulse text-indigo-500" : isListening ? "text-red-500" : "text-slate-400"} />
                </div>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleParse()}
                    placeholder={isListening ? "Listening... Say something!" : "Type to log: ......."}
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />

                <div className="flex items-center gap-1.5 border-l border-slate-100 dark:border-slate-800 pl-3">
                    <button
                        onClick={isListening ? () => recognitionRef.current.stop() : startListening}
                        className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse scale-110' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        title={isListening ? "Listening..." : "Voice Input"}
                    >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>

                    <button
                        onClick={() => handleParse()}
                        disabled={!text.trim() || isLoading}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <Send size={16} />
                    </button>

                    <div className="hidden sm:flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400">
                        <span className="opacity-50">↩</span> ENTER
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showPreview && parsedItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                    >
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reviewing Detected Entries</span>
                                <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {parsedItems.map((item, idx) => (
                                    <div key={idx} className="flex flex-col p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3 group transition-all hover:border-indigo-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`flex-shrink-0 p-2 rounded-xl ${item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : item.is_debt ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {item.is_debt ? <ArrowRight size={14} /> : item.type === 'income' ? <Check size={14} /> : <X size={14} />}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate capitalize">
                                                        {item.is_debt ? `${item.name}` : item.description}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Extracted Segment</p>
                                                </div>
                                            </div>
                                            <p className="text-lg font-mono font-black text-slate-900 dark:text-white">₹{item.amount}</p>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                                            <select
                                                value={item.type}
                                                onChange={(e) => {
                                                    const newItems = [...parsedItems];
                                                    newItems[idx].type = e.target.value;
                                                    newItems[idx].is_debt = ['lent', 'borrowed'].includes(e.target.value);
                                                    setParsedItems(newItems);
                                                }}
                                                className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg border-none outline-none text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="expense">Expense</option>
                                                <option value="income">Income</option>
                                                <option value="lent">Lent</option>
                                                <option value="borrowed">Borrowed</option>
                                            </select>

                                            <input
                                                type="text"
                                                value={item.category || (item.is_debt ? 'Ledger' : 'Other')}
                                                onChange={(e) => {
                                                    const newItems = [...parsedItems];
                                                    newItems[idx].category = e.target.value;
                                                    setParsedItems(newItems);
                                                }}
                                                placeholder="Category"
                                                className="flex-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg border-none outline-none text-slate-600 dark:text-slate-400 placeholder:text-slate-300"
                                            />

                                            <button
                                                onClick={async () => {
                                                    const cleanKeyword = (item.is_debt ? item.name : item.description).toLowerCase().trim();
                                                    try {
                                                        const res = await fetch('/api/train', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                keyword: cleanKeyword,
                                                                target_type: item.type,
                                                                target_category: item.category
                                                            })
                                                        });
                                                        if (res.ok) {
                                                            alert(`Learned: "${cleanKeyword}" is ${item.type}`);
                                                        }
                                                    } catch (err) {
                                                        console.error("Training failed", err);
                                                    }
                                                }}
                                                className="p-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white"
                                                title="Teach Bot this word"
                                            >
                                                <Sparkles size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleConfirm}
                                className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={14} /> Commit Entries
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MagicAIInput;
