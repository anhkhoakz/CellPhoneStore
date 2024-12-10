import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import { red } from "@mui/material/colors";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [cookies, setCookies] = useCookies([]);
    const navigate = useNavigate();

    // Validation state
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    // Function to validate email format
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    // Function to validate password (minimum length of 6 characters)
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Reset error messages
        setEmailError("");
        setPasswordError("");
        setErrorMessage("");

        // Validate fields
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }

        // Proceed with login API call
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    if (data.role === "admin") {
                        setCookies("_ga_QM7W25Wv18", "admin", { path: "/" });
                        window.location.replace("/admin");
                        return;
                    }
                    window.location.replace("/");
                } else {
                    setErrorMessage(data.message);
                    console.log("Login failed", data.message);
                }
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error,
                );
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
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!!emailError}
                helperText={emailError}
            />
            <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!passwordError}
                helperText={passwordError}
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

            {errorMessage && (
                <Typography sx={{ color: red[500] }}>{errorMessage}</Typography>
            )}

            <Link
                href="/forgot-password"
                variant="body2"
                sx={{ alignSelf: "flex-end" }}
            >
                Forgot password?
            </Link>
            <Button variant="contained" type="submit">
                Sign In
            </Button>
            <Typography variant="body2" align="center">
                Don't have an account?{" "}
                <Link href="/register" variant="body2">
                    Sign up
                </Link>
            </Typography>
        </Box>
    );
};

export default Login;
