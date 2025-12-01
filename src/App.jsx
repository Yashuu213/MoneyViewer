import React, { useState } from 'react';
import { TransactionProvider } from './context/TransactionContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Lending from './pages/Lending';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <TransactionProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analysis' && <Analysis />}
        {activeTab === 'lending' && <Lending />}
      </Layout>
    </TransactionProvider>
  );
}

export default App;
