import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const ChangePassword = ({ user }) => {
  return (
    <Box style={{ maxWidth: '500px', margin: '0px auto', minHeight: "35vh" }}>
      <TextField label="Mật khẩu hiện tại" type="password" fullWidth margin="normal" />
      <TextField label="Mật khẩu mới" type="password" fullWidth margin="normal" />
      <TextField label="Xác nhận mật khẩu mới" type="password" fullWidth margin="normal" />
      <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary">
          Đổi mật khẩu
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
