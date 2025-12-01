import React, { createContext, useState, useEffect } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    const [debts, setDebts] = useState(() => {
        const saved = localStorage.getItem('debts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('debts', JSON.stringify(debts));
    }, [debts]);

    const addTransaction = (transaction) => {
        setTransactions(prev => [
            { id: crypto.randomUUID(), date: new Date().toISOString(), ...transaction },
            ...prev
        ]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    // Updated: type can be 'lent' (they owe you) or 'borrowed' (you owe them)
    const addDebt = (debt) => {
        setDebts(prev => [
            { id: crypto.randomUUID(), date: new Date().toISOString(), ...debt },
            ...prev
        ]);
    };

    const deleteDebt = (id) => {
        setDebts(prev => prev.filter(d => d.id !== id));
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
