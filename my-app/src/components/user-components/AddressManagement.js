import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddAddress from './AddAddress';

const AddressManagement = ({ addresses, onAddAddress }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="h6">Quản lý địa chỉ</Typography>
      {addresses.map((addr) => (
        <Typography key={addr.id} variant="body1">{addr.address}</Typography>
      ))}
      <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleClickOpen}>
        Thêm địa chỉ
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        <DialogContent>
          <AddAddress onAddAddress={onAddAddress} onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddressManagement;
