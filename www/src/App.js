// src/App.js
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import OrderManagementPage from "./pages/OrderManagementPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminRoutes from "./admin/AdminRoutes";
import BuyPage from "./pages/BuyPage";
import CategoryPage from "./pages/CategoryPage";
import CouponPage from "./pages/CouponPage";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import InvoicePage from "./pages/InvoicePage";
import OtpPage from "./pages/OTPPage";
import PaymentGuide from "./pages/PaymentGuidePage";
import ProductRatingPage from "./pages/ProductRatingPage";
import SearchPage from "./pages/SearchPage";
import Profile from "./pages/UserProfilePage";

import { useCookies } from "react-cookie";

function App() {
    const [cookies] = useCookies([]);
    const isAuthenticated = cookies.userId || cookies.accessToken;
    const isAdmin = cookies._ga_QM7W25Wv18 === "admin";
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
                                        <Route
                                            path="/"
                                            element={<HomePage />}
                                        />
                                        <Route
                                            path="/login"
                                            element={<LoginPage />}
                                        />

                                        <Route
                                            path="/cart"
                                            element={<CartPage />}
                                        />
                                        <Route
                                            path="/register"
                                            element={<RegisterPage />}
                                        />
                                        <Route
                                            path="/product/:id"
                                            element={<ProductDetailPage />}
                                        />

                                        <Route
                                            path="/search"
                                            element={<SearchPage />}
                                        />

                                        <Route
                                            path="/verify"
                                            element={<OtpPage />}
                                        />
                                        <Route
                                            path="/buy-now"
                                            element={<BuyPage />}
                                        />
                                        <Route
                                            path="/forgot-password"
                                            element={<ForgotPasswordPage />}
                                        />
                                        <Route
                                            path="/payment-guide"
                                            element={<PaymentGuide />}
                                        />

                                        <Route
                                            path="/forgot-password/:token"
                                            element={<ForgotPasswordPage />}
                                        />
                                        <Route
                                            path="/catagory/:category"
                                            element={<CategoryPage />}
                                        />

                                        <Route
                                            path="/success"
                                            element={<OrderSuccessPage />}
                                        />

                                        {isAuthenticated && (
                                            <>
                                                <Route
                                                    path="/orderManagement"
                                                    element={
                                                        <OrderManagementPage />
                                                    }
                                                />

                                                <Route
                                                    path="/profile"
                                                    element={<Profile />}
                                                />
                                                <Route
                                                    path="/rating"
                                                    element={
                                                        <ProductRatingPage />
                                                    }
                                                />
                                                <Route
                                                    path="/coupon"
                                                    element={<CouponPage />}
                                                />

                                                <Route
                                                    path="/invoice"
                                                    element={<InvoicePage />}
                                                />
                                            </>
                                        )}
                                        <Route
                                            path="/*"
                                            element={<Error404 />}
                                        />
                                        <Route
                                            path="/403"
                                            element={<Error403 />}
                                        />
                                    </Routes>
                                </main>
                                <Footer />
                            </>
                        }
                    />
                    {isAdmin && (
                        <Route path="/admin/*" element={<AdminRoutes />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
