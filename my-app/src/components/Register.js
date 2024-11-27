// src/components/Register.js
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessages, setErrorMessages] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
        // Xử lý đăng ký ở đây

        // Gọi API để đăng ký
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
                    console.log("Error:", data);
                    setErrorMessages(data.message);
                    return;
                }
                
                alert("Register success");

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
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
                <Link href="/login" variant="body2">
                    Sign in
                </Link>
            </Typography>
        </Box>
    );
};

export default Register;
