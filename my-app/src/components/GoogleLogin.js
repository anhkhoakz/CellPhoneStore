import React from 'react';
import { Button, Box } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    console.log('Đăng nhập bằng Google');
    // Xử lý đăng nhập bằng Google ở đây
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
        onClick={handleGoogleLogin}
        startIcon={<GoogleIcon />}
        sx={{
          backgroundColor: 'green',
          color: 'white',
          width: 400, 
          '&:hover': {
            backgroundColor: 'darkgreen',
          },
        }}
      >
        Sign In With Google
      </Button>
    </Box>
  );
};

export default GoogleLogin;
