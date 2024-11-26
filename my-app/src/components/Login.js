import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();

        console.log("Email:", email);
        console.log("Password:", password);

       
        // Xử lý đăng nhập ở đây

        fetch("http://localhost:8080/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                if (data.code === 200) {
                    console.log(data);
                    console.log("Login success");
                    navigate("/");

                } else {
                    console.log(data.message);
                    console.log("Login failed");
                }
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
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
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
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
