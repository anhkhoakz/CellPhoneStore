// src/components/Footer.js
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container>
        <Typography variant="body1" align="center">
          &copy; {new Date().getFullYear()} Công ty của tôi
        </Typography>
        <Typography variant="body2" align="center">
          <Link href="#" color="inherit" underline="hover">
            Điều khoản sử dụng
          </Link>{' '}
          |{' '}
          <Link href="#" color="inherit" underline="hover">
            Chính sách bảo mật
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
