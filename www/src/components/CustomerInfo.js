// src/components/CustomerInfo.js
import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";

const CustomerInfo = ({ setName, setPhone, setAddress }) => {
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

            <TextField
                fullWidth
                variant="outlined"
                label="Shipping Address"
                multiline
                rows={3}
                onChange={(e) => setAddress(e.target.value)}
                required
                margin="normal"
            />
        </Box>
    );
};

export default CustomerInfo;
