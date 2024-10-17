import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import googleLogo from "../assets/image/google-logo.png";

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState("");

    const handleGoogleLogin = () => {
        console.log("Logging in with Google...");
        // Thêm logic xử lý đăng nhập với Google ở đây
    };

    const handleLogin = (credentials) => {
        const { email, password } = credentials;
        if (email === "user@example.com" && password === "password123") {
            console.log("Login successful!");
            setErrorMessage("");
        } else {
            setErrorMessage("Invalid email or password.");
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <button className="google-login" onClick={handleGoogleLogin}>
                <img
                    src={googleLogo}
                    alt="Google Logo"
                    className="google-logo"
                />
                Google
            </button>
            <div className="divider">or</div>
            <LoginForm onLogin={handleLogin} />
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            <div className="register-link">
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Sign up now</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
