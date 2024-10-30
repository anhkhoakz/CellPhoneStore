// src/components/GoogleRegister.js
import React from 'react';
import { Button, Box } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const GoogleRegister = () => {
    const handleGoogleRegister = () => {
        console.log('Đăng ký bằng Google');
        // Xử lý đăng ký bằng Google ở đây
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Button
                variant="contained"
                onClick={handleGoogleRegister}
                startIcon={<GoogleIcon />}
                sx={{
                    backgroundColor: 'green',
                    color: 'white',
                    width: '20%',
                    '&:hover': {
                        backgroundColor: 'darkgreen',
                    },
                }}
            >
                Sign Up With Google
            </Button>
        </Box>
    );
};

export default GoogleRegister;
