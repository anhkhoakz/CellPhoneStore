import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const UserInfo = ({ user, onUserInfoChange }) => {
  const handleChange = (e) => {
    onUserInfoChange({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Typography variant="h6">Thông tin cá nhân</Typography>
      <TextField 
        label="Tên" 
        name="name" 
        value={user.name} 
        onChange={handleChange} 
        fullWidth 
        margin="normal" 
      />
      <TextField 
        label="Email" 
        name="email" 
        value={user.email} 
        onChange={handleChange} 
        fullWidth 
        margin="normal" 
      />
      <TextField 
        label="Số điện thoại" 
        name="phone" 
        value={user.phone} 
        onChange={handleChange} 
        fullWidth 
        margin="normal" 
      />
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Lưu thay đổi
      </Button>
    </div>
  );
};

export default UserInfo;
