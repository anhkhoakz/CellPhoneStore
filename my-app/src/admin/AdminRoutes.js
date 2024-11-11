// src/admin/AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import DiscountManagement from './pages/DiscountManagement'


const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
      <Route path="/" element={<Dashboard />} />
        <Route path="user" element={<UserManagement />} />
        <Route path="order" element={<OrderManagement />} />
        <Route path="product" element={<ProductManagement />} />
        <Route path="discount" element={<DiscountManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
