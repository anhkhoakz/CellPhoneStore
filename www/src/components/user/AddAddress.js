import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const AddAddress = ({ onAddAddress, onClose }) => {
    const [cookies] = useCookies([]);

    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [receiver, setReceiver] = useState("");
    const [phone, setPhone] = useState("");

    const [errors, setErrors] = useState({
        address: "",
        province: "",
        district: "",
        ward: "",
        receiver: "",
        phone: "",
    });

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

    const handleAddAddress = () => {
        let formErrors = { address: "", province: "", district: "", ward: "", receiver: "", phone: "" };
        if (!address)
            formErrors.address = "Detailed address cannot be left blank.";
        if (!province) formErrors.province = "Please select province.";
        if (!district) formErrors.district = "Please select district.";
        if (!ward) formErrors.ward = "Please select commune/ward.";
        if (!receiver) formErrors.receiver = "Receiver name cannot be left blank.";
        if (!phone) formErrors.phone = "Phone number cannot be left blank.";
        setErrors(formErrors);
        if (
            !formErrors.address &&
            !formErrors.province &&
            !formErrors.district &&
            !formErrors.ward &&
            !formErrors.receiver &&
            !formErrors.phone
        ) {
            const fullAddress = `${address}, ${ward}, ${district}, ${province}`;

            fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/addAddress/${cookies.userId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies.accessToken}`,
                    },
                    body: JSON.stringify({
                        detail: fullAddress,
                        city: province,
                        district: district,
                        village: ward,
                        receiver: receiver,
                        phone: phone,
                    }),
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Failed to add address");
                })
                .then((data) => {
                    console.log(data);
                    if(data.code === 200)
                    {
                        onAddAddress(data.detail);
                        onClose();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <Box
            style={{ maxWidth: "500px", margin: "0px auto", minHeight: "35vh" }}
        >
            <FormControl fullWidth margin="normal" error={!!errors.province}>
                <InputLabel>Province</InputLabel>
                <Select
                    value={province}
                    onChange={handleProvinceChange}
                    label="Province"
                >
                    {provinces.map((prov) => (
                        <MenuItem key={prov.FullNameEn} value={prov.FullNameEn}>
                            {prov.FullNameEn}
                        </MenuItem>
                    ))}
                </Select>
                {errors.province && (
                    <FormHelperText>{errors.province}</FormHelperText>
                )}
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
                        <MenuItem key={dist.FullNameEn} value={dist.FullNameEn}>
                            {dist.FullNameEn}
                        </MenuItem>
                    ))}
                </Select>
                {errors.district && (
                    <FormHelperText>{errors.district}</FormHelperText>
                )}
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
                        <MenuItem key={wd.FullNameEn} value={wd.FullNameEn}>
                            {wd.FullNameEn}
                        </MenuItem>
                    ))}
                </Select>
                {errors.ward && <FormHelperText>{errors.ward}</FormHelperText>}
            </FormControl>

            <TextField
                label="Detailed address"
                fullWidth
                margin="normal"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
            />

            <TextField
                label="Receiver name"
                fullWidth
                margin="normal"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                error={!!errors.receiver}
                helperText={errors.receiver}
            />

            <TextField
                label="Phone number"
                type="tel"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
            />
            <Box textAlign="center" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAddress}
                >
                    Add New Address
                </Button>
            </Box>
        </Box>
    );
};

AddAddress.propTypes = {
    onAddAddress: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddAddress;
