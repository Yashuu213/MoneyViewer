import React, { createContext, useState, useEffect } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check auth status on load
    useEffect(() => {
        checkAuth();
    }, []);

    // Fetch data when user changes
    useEffect(() => {
        if (user) {
            fetchTransactions();
            fetchDebts();
        } else {
            setTransactions([]);
            setDebts([]);
        }
    }, [user]);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/check_auth');
            const data = await res.json();
            if (data.isAuthenticated) {
                setUser({ username: data.username });
            }
        } catch (err) {
            console.error("Auth check failed", err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUser({ username: data.username });
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (err) {
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        setUser(null);
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/transactions');
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    const fetchDebts = async () => {
        try {
            const res = await fetch('/api/debts');
            if (res.ok) {
                const data = await res.json();
                setDebts(data);
            }
        } catch (err) {
            console.error("Failed to fetch debts", err);
        }
    };

    const addTransaction = async (transaction) => {
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });
            if (res.ok) {
                fetchTransactions(); // Refresh list
            }
        } catch (err) {
            console.error("Failed to add transaction", err);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTransactions(prev => prev.filter(t => t.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete transaction", err);
        }
    };

    const addDebt = async (debt) => {
        try {
            const res = await fetch('/api/debts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(debt)
            });
            if (res.ok) {
                fetchDebts(); // Refresh list
            }
        } catch (err) {
            console.error("Failed to add debt", err);
        }
    };

    const deleteDebt = async (id) => {
        try {
            const res = await fetch(`/api/debts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDebts(prev => prev.filter(d => d.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete debt", err);
        }
    };

    // Calculate net balance per person
    const getPersonBalance = (personName) => {
        return debts
            .filter(d => d.name.toLowerCase() === personName.toLowerCase())
            .reduce((total, debt) => {
                return total + (debt.type === 'lent' ? debt.amount : -debt.amount);
            }, 0);
    };

    // Get unique people with their balances
    const getPeopleBalances = () => {
        const peopleMap = {};
        debts.forEach(debt => {
            const name = debt.name;
            if (!peopleMap[name]) {
                peopleMap[name] = { name, balance: 0, transactions: [] };
            }
            const amount = debt.type === 'lent' ? debt.amount : -debt.amount;
            peopleMap[name].balance += amount;
            peopleMap[name].transactions.push({ ...debt, netAmount: amount });
        });
        return Object.values(peopleMap);
    };

    return (
        <TransactionContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            transactions,
            addTransaction,
            deleteTransaction,
            debts,
            addDebt,
            deleteDebt,
            getPersonBalance,
            getPeopleBalances
        }}>
            {children}
        </TransactionContext.Provider>
    );
};
