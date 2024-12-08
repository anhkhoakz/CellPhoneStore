import { Box, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";


const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};



const CustomerInfo = ({ setName, setPhone, setAddress }) => {
    const [address, setAddressInput] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [errors, setErrors] = useState({
        address: "",
        province: "",
        district: "",
        ward: "",
    });


    
    
    const debouncedAddress = useDebounce(address, 3000); 

    const [cookies] = useCookies([]);

    // Fetch provinces data
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                "https://cdn.jsdelivr.net/gh/ThangLeQuoc/vietnamese-provinces-database@master/json/simplified_json_generated_data_vn_units_minified.json"
            );
            const data = await response.json();
            setProvinces(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        // setAddress(`${address}, ${ward}, ${district}, ${province}`);
        setAddress(`${debouncedAddress}, ${ward}, ${district}, ${province}`);
    }, [debouncedAddress, address, district]);

    const handleProvinceChange = (e) => {
        const selectedProvince = e.target.value;
        setProvince(selectedProvince);
        const selectedProvinceData = provinces.find(
            (prov) => prov.FullNameEn === selectedProvince
        );
        setDistricts(selectedProvinceData.District);
        setWard("");
        setDistrict("");
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;
        setDistrict(selectedDistrict);
        const selectedProvince = provinces.find(
            (prov) => prov.FullNameEn === province
        );
        const selectedDistrictData = selectedProvince.District.find(
            (dist) => dist.FullNameEn === selectedDistrict
        );
        setWards(selectedDistrictData.Ward);
        setWard("");
    };
    return (
        <Box className="p-5">
            <Typography variant="h5" component="h3" gutterBottom>
                Customer Information
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                label="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
            />

            <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
                required
                margin="normal"
            />

            {/* Province Select */}
            <FormControl fullWidth margin="normal" error={!!errors.province}>
                <InputLabel>Province</InputLabel>
                <Select value={province} onChange={handleProvinceChange} label="Province">
                    {provinces.map((prov) => (
                        <MenuItem key={prov.FullNameEn} value={prov.FullNameEn}>
                            {prov.FullNameEn}
                        </MenuItem>
                    ))}
                </Select>
                {errors.province && <FormHelperText>{errors.province}</FormHelperText>}
            </FormControl>

            {/* District Select */}
            <FormControl fullWidth margin="normal" error={!!errors.district}>
                <InputLabel>District</InputLabel>
                <Select
                    value={district}
                    onChange={handleDistrictChange}
                    label="District"
                    disabled={!province}
                >
                    {districts.map((dist) => (
                        <MenuItem key={dist.FullNameEn} value={dist.FullNameEn}>
                            {dist.FullNameEn}
                        </MenuItem>
                    ))}
                </Select>
                {errors.district && <FormHelperText>{errors.district}</FormHelperText>}
            </FormControl>

            {/* Ward Select */}
            <FormControl fullWidth margin="normal" error={!!errors.ward}>
                <InputLabel>Commune/Ward</InputLabel>
                <Select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    label="Commune/Ward"
                    disabled={!district}
                >
                    {wards.map((wd) => (
                        <MenuItem key={wd.FullNameEn} value={wd.FullNameEn}>
                            {wd.FullNameEn}
                        </MenuItem>
                    ))}
                </Select>
                {errors.ward && <FormHelperText>{errors.ward}</FormHelperText>}
            </FormControl>

            {/* Address Fields */}
            <TextField
                label="Detailed Address"
                fullWidth
                margin="normal"
                value={address}
                onChange={(e) => {setAddressInput(e.target.value)}}
                error={!!errors.address}
                helperText={errors.address}
            />
        </Box>
    );
};

export default CustomerInfo;
