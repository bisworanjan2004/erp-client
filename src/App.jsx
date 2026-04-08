import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/inventory/InventoryList';
import TicketList from './pages/support/TicketList';
import CommunicationPage from './pages/communication/CommunicationPage';
import RegistrationPage from './pages/registration/RegistrationPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/support" element={<TicketList />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
