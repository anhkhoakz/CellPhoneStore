import { Box, Divider, Typography } from "@mui/material";
// src/pages/LoginPage.js
import React from "react";
import GoogleLogin from "../components/login/GoogleLogin";
import Login from "../components/login/Login";
import ContinueAsGuest from "../components/register/ContinueAsGuest";
// import { Cookie } from '@mui/icons-material';

import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";

import { useEffect } from "react";

const LoginPage = () => {
    const [_cookies] = useCookies([]);
    const navigate = useNavigate();

    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                console.log("Response:", res);
                if (res.status === 200) {
                    navigate("/");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <Box sx={{ padding: 3, minHeight: "85vh" }}>
            <Typography
                style={{ margin: "1.25em 0" }}
                variant="h3"
                align="center"
            >
                Sign In
            </Typography>
            <GoogleLogin />
            <Divider sx={{ margin: 2 }}>Or</Divider>
            <Login />
            <ContinueAsGuest />
        </Box>
    );
};

export default LoginPage;
