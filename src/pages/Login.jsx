import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, LogIn, Mail, Loader2, KeyRound, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Forgot Password State
    const [forgotMode, setForgotMode] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login, sendOtp, resetPassword } = useContext(TransactionContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleSendResetOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError("Please enter your email first");
            return;
        }

        setIsLoading(true);
        const result = await sendOtp(email, 'reset');
        if (result.success) {
            setOtpSent(true);
            setMessage(`Password reset OTP sent to ${email}`);
        } else {
            setError(result.error || 'Failed to send reset email');
        }
        setIsLoading(false);
    };

    const handleVerifyReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        const result = await resetPassword(email, otp, newPassword);
        if (result.success) {
            setMessage("Password reset successful! You can now login.");
            setForgotMode(false);
            setOtpSent(false);
            setPassword('');
        } else {
            setError(result.error || 'Failed to reset password');
        }
        setIsLoading(false);
    };

    const resetStates = () => {
        setForgotMode(false);
        setOtpSent(false);
        setError('');
        setMessage('');
        setPassword('');
        setOtp('');
        setNewPassword('');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 w-full max-w-md border border-gray-50 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-4 rounded-3xl mb-4 shadow-lg shadow-blue-500/30">
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        {forgotMode ? "Reset Password" : "Welcome Back"}
                    </h2>
                    <p className="text-gray-400 font-medium mt-1">
                        {forgotMode ? "Enter details to reset" : "Manage your money smarter"}
                    </p>
                </div>
                
                {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100 text-center">{error}</div>}
                {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-emerald-100 text-center">{message}</div>}
                
                {!forgotMode ? (
                    <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                                <button type="button" onClick={() => setForgotMode(true)} className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    // FORGOT PASSWORD FLOW
                    <div className="animate-in slide-in-from-right-4">
                        {!otpSent ? (
                            <form onSubmit={handleSendResetOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                                    Send Reset OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyReset} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Reset OTP Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-black text-center text-2xl tracking-[0.5em] text-gray-900"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                                    Set New Password
                                </button>
                            </form>
                        )}
                        <button
                            type="button"
                            onClick={resetStates}
                            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 font-bold py-4 mt-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </button>
                    </div>
                )}
                
                <p className="mt-8 text-center text-gray-500 font-medium">
                    New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
