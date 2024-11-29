import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import UserInfo from '../components/user-components/UserInfo';
import AddressManagement from '../components/user-components/AddressManagement';
import ChangePassword from '../components/user-components/ChangePassword';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const UserProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Nguyễn Văn A',
    email: 'email@example.com',
    phone: '0123456789',
    addresses: [
      { id: 1, address: '123 Đường A, Quận 1, TP.HCM', isDefault: true },
      { id: 2, address: '456 Đường B, Quận 2, TP.HCM', isDefault: false },
    ]
  });

  const [open, setOpen] = useState(false);

  const handleUserInfoChange = (updatedUserInfo) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserInfo }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAddress = (newAddress) => {
    setUser((prevUser) => ({
      ...prevUser,
      addresses: [
        ...prevUser.addresses,
        { id: prevUser.addresses.length + 1, isDefault: false, ...newAddress }
      ]
    }));
  };

  // Hàm đặt địa chỉ mặc định
  const handleSetDefaultAddress = (id) => {
    setUser((prevUser) => ({
      ...prevUser,
      addresses: prevUser.addresses.map((addr) =>
        addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
      )
      
    }));
  };

  return (
    <Grid
      container
      spacing={3}
      style={{ minHeight: '100vh' }}
      justifyContent="center"
      alignItems="center"
      direction="column"
      marginTop={3}
    >
      <Typography variant="h4" gutterBottom align="center">
        Quản lý thông tin cá nhân
      </Typography>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: '20px', width: '80vh', maxWidth: '80vh' }}>
          <UserInfo user={user} onUserInfoChange={handleUserInfoChange} />
          <Button variant="contained" color="secondary" onClick={handleClickOpen} sx={{ marginTop: '20px' }}>
            Đổi mật khẩu
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} mb={2}>
        <Paper elevation={3} sx={{ padding: '20px', width: '80vh', maxWidth: '80vh' }}>
          <AddressManagement 
            addresses={user.addresses} 
            onAddAddress={handleAddAddress} 
            onSetDefaultAddress={handleSetDefaultAddress} 
          />
        </Paper>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <ChangePassword user={user} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default UserProfilePage;
