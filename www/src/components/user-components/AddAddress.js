import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText'; 

const AddAddress = ({ onAddAddress, onClose }) => {
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  // Các thông báo lỗi
  const [errors, setErrors] = useState({
    address: '',
    province: '',
    district: '',
    ward: ''
  });

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://cdn.jsdelivr.net/gh/ThangLeQuoc/vietnamese-provinces-database@master/json/simplified_json_generated_data_vn_units_minified.json');
      const data = await response.json();
      setProvinces(data); // Lưu danh sách tỉnh
    };
    
    fetchData();
  }, []);

  // Xử lý thay đổi tỉnh để cập nhật huyện
  const handleProvinceChange = async (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    
    const data = await fetch('https://cdn.jsdelivr.net/gh/ThangLeQuoc/vietnamese-provinces-database@master/json/simplified_json_generated_data_vn_units_minified.json');
    const provincesData = await data.json();
    const selectedProvinceData = provincesData.find((prov) => prov.CodeName === selectedProvince);
    
    setDistricts(selectedProvinceData.District); // Cập nhật danh sách huyện theo tỉnh
    setWard(''); // Đặt lại xã/phường
    setDistrict(''); // Đặt lại huyện
  };

  // Xử lý thay đổi huyện để cập nhật xã/phường
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);

    const selectedProvince = provinces.find((prov) => prov.CodeName === province);
    const selectedDistrictData = selectedProvince.District.find((dist) => dist.CodeName === selectedDistrict);

    setWards(selectedDistrictData.Ward); 
    setWard(''); 
  };

  // Xử lý thêm địa chỉ và kiểm tra lỗi
  const handleAddAddress = () => {
    let formErrors = { address: '', province: '', district: '', ward: '' };

    // Kiểm tra các trường
    if (!address) formErrors.address = 'Detailed address cannot be left blank.';
    if (!province) formErrors.province = 'Please select province.';
    if (!district) formErrors.district = 'Please select district.';
    if (!ward) formErrors.ward = 'Please select commune/ward.';
    
    setErrors(formErrors);

    // Nếu không có lỗi, gửi thông tin địa chỉ lên parent và đóng modal
    if (!formErrors.address && !formErrors.province && !formErrors.district && !formErrors.ward) {
      const fullAddress = `${address}, ${ward}, ${district}, ${province}`; // Kết hợp địa chỉ đầy đủ
      onAddAddress({ address: fullAddress, ward, district, province }); // Truyền lên hàm onAddAddress
      onClose(); // Đóng modal
    }
  };
  

  return (
    <Box style={{ maxWidth: '500px', margin: '0px auto', minHeight: '35vh' }}>
      <TextField
        label="Detailed address"
        fullWidth
        margin="normal"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        error={!!errors.address}
        helperText={errors.address}
      />

      <FormControl fullWidth margin="normal" error={!!errors.province}>
        <InputLabel>Province</InputLabel>
        <Select
          value={province}
          onChange={handleProvinceChange}
          label="Province"
        >
          {provinces.map((prov) => (
            <MenuItem key={prov.CodeName} value={prov.CodeName}>
              {prov.FullName}
            </MenuItem>
          ))}
        </Select>
        {errors.province && <FormHelperText>{errors.province}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.district}>
        <InputLabel>District</InputLabel>
        <Select
          value={district}
          onChange={handleDistrictChange}
          label="District"
          disabled={!province} 
        >
          {districts.map((dist) => (
            <MenuItem key={dist.CodeName} value={dist.CodeName}>
              {dist.FullName}
            </MenuItem>
          ))}
        </Select>
        {errors.district && <FormHelperText>{errors.district}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.ward}>
        <InputLabel>Commune/Ward</InputLabel>
        <Select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          label="Commune/Ward"
          disabled={!district} 
        >
          {wards.map((wd) => (
            <MenuItem key={wd.CodeName} value={wd.CodeName}>
              {wd.FullName}
            </MenuItem>
          ))}
        </Select>
        {errors.ward && <FormHelperText>{errors.ward}</FormHelperText>}
      </FormControl>

      <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary" onClick={handleAddAddress}>
          Add New Address
        </Button>
      </Box>
    </Box>
  );
};

export default AddAddress;
