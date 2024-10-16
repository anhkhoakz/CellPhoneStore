import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import OrderManagementPage from './pages/OrderManagementPage'
import CartPage from './pages/CartPage'
import RegisterPage from './pages/RegisterPage'
import './App.css';
import LoginPage from './pages/LoginPage';
import ProductDetail from './pages/ProductDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import 'bootstrap-icons/font/bootstrap-icons.css';



// Data test
const yourProductsArray = [
  {
    id: 1,
    name: 'Sản phẩm 1',
    price: 100,
    description: 'Mô tả sản phẩm 1',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Sản phẩm 2',
    price: 200,
    description: 'Mô tả sản phẩm 2',
    image: 'https://via.placeholder.com/150',
  },
];


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orderManagement" element={<OrderManagementPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/register" element={<RegisterPage />} />


            {/* Test trang chi tiết sản phẩm */}
            <Route path="/product/:id" element={<ProductDetail products={yourProductsArray} />} /> 
          
            <Route path="/success" element={<OrderSuccessPage />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
