// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import OrderManagementPage from './pages/OrderManagementPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchPage from './pages/SearchPage';
import Error404 from './pages/Error404';
import Error403 from './pages/Error403';
import Profile from './pages/UserProfilePage';
import OtpPage from './pages/OTPPage';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes for the user */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Navigation />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/orderManagement" element={<OrderManagementPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/success" element={<OrderSuccessPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/verify" element={<OtpPage />} />
                    <Route path="/*" element={<Error404 />} />
                    <Route path="/403" element={<Error403 />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
          
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
