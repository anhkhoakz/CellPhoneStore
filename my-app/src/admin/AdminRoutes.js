// src/admin/AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'


const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="order-management" element={<OrderManagement />} />
        <Route path="product-management" element={<ProductManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
