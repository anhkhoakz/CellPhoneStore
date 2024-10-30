// src/pages/RegisterPage.js
import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Register from '../components/Register';
import GoogleRegister from '../components/GoogleRegister';

const RegisterPage = () => {
    return (
        <Box sx={{ padding: 3, minHeight: "85vh" }}>
            <Typography style={{ margin: '20px 0' }} variant="h3" align="center">
                Sign Up
            </Typography>
            <GoogleRegister />
            <Divider sx={{ margin: 2 }}>Or</Divider>
            <Register />
        </Box>
    );
};

export default RegisterPage;
