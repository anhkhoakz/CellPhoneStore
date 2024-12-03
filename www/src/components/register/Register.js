import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessages, setErrorMessages] = useState("");

    const navigate = useNavigate();

    const [cookies, setCookie] = useCookies([]);

    // State for showing/hiding passwords
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation functions
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessages(""); // Clear any previous error messages

        // Validate fields
        if (!validateEmail(email)) {
            setErrorMessages("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessages("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessages("Passwords do not match.");
            return;
        }

        // Proceed with the registration API call
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: name,
                email,
                password,
                confirmPassword,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code !== 201) {
                    setErrorMessages(data.message);
                    return;
                }

                setCookie("email", email, {
                    maxAge: 60 * 5,
                    httpOnly: false,
                    sameSite: "lax",
                });

                navigate("/verify");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error:", error);
            });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
                margin: "auto",
            }}
        >
            <TextField
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!validateEmail(email) && email.length > 0}
                helperText={
                    !validateEmail(email) && email.length > 0
                        ? "Invalid email format"
                        : ""
                }
            />
            <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={password && !validatePassword(password)}
                helperText={
                    password && !validatePassword(password)
                        ? "Password must be at least 6 characters"
                        : ""
                }
                InputProps={{
                    endAdornment: (
                        <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            aria-label="toggle password visibility"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    ),
                }}
            />
            <TextField
                label="Confirm Password"
                variant="outlined"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={confirmPassword && confirmPassword !== password}
                helperText={
                    confirmPassword && confirmPassword !== password
                        ? "Passwords do not match"
                        : ""
                }
                InputProps={{
                    endAdornment: (
                        <IconButton
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                            aria-label="toggle password visibility"
                        >
                            {showConfirmPassword ? (
                                <VisibilityOff />
                            ) : (
                                <Visibility />
                            )}
                        </IconButton>
                    ),
                }}
            />

            {errorMessages && (
                <Typography variant="body2" color="error">
                    {errorMessages}
                </Typography>
            )}

            <Button variant="contained" type="submit">
                Sign Up
            </Button>
            <Typography variant="body2" align="center">
                Already have an account?{" "}
                <Link href="/login/Login" variant="body2">
                    Sign in
                </Link>
            </Typography>
        </Box>
    );
};

export default Register;
