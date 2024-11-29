import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';

const AddAddress = ({ onAddAddress, onClose }) => {
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');

  const provinces = ['TP.HCM', 'Hà Nội', 'Đà Nẵng'];
  const districts = ['Quận 1', 'Quận 2', 'Quận 3'];
  const wards = ['Phường 1', 'Phường 2', 'Phường 3'];

  const handleAddAddress = () => {
    onAddAddress({ address: `${address}, ${ward}, ${district}, ${province}` });
    onClose();
  };

  return (
    <Box style={{ maxWidth: '500px', margin: '0px auto', minHeight: '35vh' }}>
      <TextField
        label="Địa chỉ chi tiết"
        fullWidth
        margin="normal"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Tỉnh</InputLabel>
        <Select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          label="Tỉnh"
        >
          {provinces.map((prov, index) => (
            <MenuItem key={index} value={prov}>
              {prov}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Huyện</InputLabel>
        <Select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          label="Huyện"
        >
          {districts.map((dist, index) => (
            <MenuItem key={index} value={dist}>
              {dist}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Xã/Phường</InputLabel>
        <Select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          label="Xã/Phường"
        >
          {wards.map((wd, index) => (
            <MenuItem key={index} value={wd}>
              {wd}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary" onClick={handleAddAddress}>
          Thêm địa chỉ
        </Button>
      </Box>
    </Box>
  );
};

export default AddAddress;
