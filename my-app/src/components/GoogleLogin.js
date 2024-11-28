import React from 'react';
import { Button, Box } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';


const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    console.log('Đăng nhập bằng Google');
    // Xử lý đăng nhập bằng Google ở đây
    // i don't want to use fetch here, because it will redirect to google login page
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/login/google`;


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
          backgroundColor: 'red',
          color: 'white',
          width: 400, 
          '&:hover': {
            backgroundColor: 'darkred',
          },
        }}
      >
        Sign In With Google
      </Button>
    </Box>
  );
};

export default GoogleLogin;
