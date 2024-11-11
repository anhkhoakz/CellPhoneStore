import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddAddress from './AddAddress';

const AddressManagement = ({ addresses, onAddAddress, onSetDefaultAddress }) => {
  const [open, setOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(
    addresses.find((addr) => addr.isDefault)?.id || ''
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDefaultAddressChange = (event) => {
    const selectedId = event.target.value;
    setDefaultAddress(selectedId);
    onSetDefaultAddress(selectedId); 
  };

  return (
    <div>
      <Typography variant="h6">Quản lý địa chỉ</Typography>

      <Typography variant="subtitle1">Chọn địa chỉ mặc định</Typography>
      <Select
        value={defaultAddress}
        onChange={handleDefaultAddressChange}
        fullWidth
      >
        {addresses.map((addr) => (
          <MenuItem key={addr.id} value={addr.id}>
            {addr.address} {addr.isDefault ? "(Mặc định)" : ""}
          </MenuItem>
        ))}
      </Select>

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
