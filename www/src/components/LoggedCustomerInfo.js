// src/components/LoggedCustomerInfo.js
import React from "react";
import {
    TextField,
    Typography,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";

const LoggedCustomerInfo = ({
    name,
    phone,
    setPhone,
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
}) => {
    return (
        <Box className="p-5">
            <Typography variant="h5" component="h3" gutterBottom>
                Customer Information
            </Typography>

            {/* Display name as text (read-only) */}
            <Typography variant="h6" gutterBottom>
                Full name: {name}
            </Typography>

            {/* Phone number input is editable */}
            <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // Handle phone change
                margin="normal"
            />

            {/* ComboBox for selecting a saved address */}
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Saved Address</InputLabel>
                <Select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    label="Saved Address"
                >
                    {savedAddresses.map((address, index) => (
                        <MenuItem key={index} value={address}>
                            {address}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default LoggedCustomerInfo;
