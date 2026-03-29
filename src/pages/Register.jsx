import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TransactionContext } from '../context/TransactionContext';
import { Wallet, UserPlus, Loader2 } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(TransactionContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        const result = await register(username, password);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error || 'Registration failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 w-full max-w-md border border-gray-50 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-600 p-4 rounded-3xl mb-4 shadow-lg shadow-blue-500/30">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
                    <p className="text-gray-400 font-medium mt-1">Start tracking your money today</p>
                </div>
                
                {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100 animate-in slide-in-from-top-2 text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                            placeholder="Repeat password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                        {isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-500 font-medium">
                    Already have one? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
