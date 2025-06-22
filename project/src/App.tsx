import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import PurchaseRequest from './pages/PurchaseRequest';
import PurchaseOrder from './pages/PurchaseOrder';
import GoodsReceipt from './pages/GoodsReceipt';
import Inventory from './pages/Inventory';
import Storage from './pages/Storage';
import Processing from './pages/Processing';
import Transportation from './pages/Transportation';
import Reports from './pages/Reports';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedRoute />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchase-request" element={<PurchaseRequest />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/goods-receipt" element={<GoodsReceipt />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  );
}

export default App;