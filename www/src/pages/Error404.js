import React from 'react';
import { Button, Typography, Box } from '@mui/material';

const Error404 = () => {
  return (
    <Box
      sx={{
        display: 'table',
        width: '100%',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f4f4f4',
      }}
    >
      <Box
        sx={{
          display: 'table-cell',
          verticalAlign: 'middle',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '50px',
            display: 'inline-block',
            paddingRight: '12px',
            animation: 'type 0.5s alternate infinite',
          }}
        >
          Error 404
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '20px' }}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          sx={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Box>
  );
};

export default Error404;
