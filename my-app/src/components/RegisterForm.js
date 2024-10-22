import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

const RegisterForm = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match!");
        } else {
            setErrorMessage("");
            onRegister(formData); 
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                />
                <label htmlFor="floatingName">Name</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="tel"
                    className="form-control"
                    id="floatingPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                />
                <label htmlFor="floatingPhone">Phone Number</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
                <label htmlFor="floatingEmail">Email</label>
            </div>

            <div className="form-floating mb-3 position-relative">
                <input
                    type={showPassword ? "text" : "password"} 
                    className="form-control"
                    id="floatingPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
                <label htmlFor="floatingPassword">Password</label>
                {formData.password && (
                    <span
                        onClick={toggleShowPassword}
                        style={{ position: 'absolute', top: '20px', right: '12px', cursor: 'pointer' }}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> 
                    </span>
                )}
            </div>

            <div className="form-floating mb-3 position-relative">
                <input
                    type={showConfirmPassword ? "text" : "password"} 
                    className="form-control"
                    id="floatingConfirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                />
                <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                {formData.confirmPassword && (
                    <span
                        onClick={toggleShowConfirmPassword}
                        style={{ position: 'absolute', top: '20px', right: '12px', cursor: 'pointer' }}
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} /> 
                    </span>
                )}
            </div>

            {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
            )}
            <button type="submit" className="btn btn-primary w-100">
                Register
            </button>
        </form>
    );
};

export default RegisterForm;
