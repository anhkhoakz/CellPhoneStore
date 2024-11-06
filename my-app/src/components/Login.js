import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    // Xử lý đăng nhập ở đây
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}
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
      <Link href="/forgot-password" variant="body2" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link>
      <Button variant="contained" type="submit">Sign In</Button>
      <Typography variant="body2" align="center">
        Don't have an account?{' '}
        <Link href="/register" variant="body2">
          Sign up
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
