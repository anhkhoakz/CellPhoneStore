// src/pages/LoginPage.js
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Login from '../components/Login';
import GoogleLogin from '../components/GoogleLogin';

const LoginPage = () => {
    return (
        <Box sx={{ padding: 3, minHeight: "85vh" }}>
            <Typography style={{ margin: '20px 0' }} variant="h3" align="center">
                Sign In
            </Typography>
            <GoogleLogin />
            <Divider sx={{ margin: 2 }}>Or</Divider>
            <Login />
        </Box>
    );
};

export default LoginPage;
