import React, { useState } from "react";
import { TextField, Select, MenuItem, InputLabel, FormControl, Button, Typography, Box } from "@mui/material";

const Summary = ({ subtotal, total, shipping, setShipping }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = () => {
        console.log("Customer Information:", { name, phone, address });
        console.log("Shipping:", shipping);
        console.log("Total Price:", total);
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                margin="normal"
            />

            <TextField
                fullWidth
                variant="outlined"
                label="Phone Number"
                type="tel"
                value={phone}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                margin="normal"
            />

            <hr className="my-4" />

            <Typography variant="h5" component="h3" gutterBottom>
                Summary
            </Typography>

            <Typography variant="h6" gutterBottom>
                Shipping
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Delivery Method</InputLabel>
                <Select
                    value={shipping}
                    onChange={(e) => setShipping(Number(e.target.value))}
                    label="Delivery Method"
                >
                    <MenuItem value={5}>Standard Delivery - $5.00</MenuItem>
                    <MenuItem value={10}>Express Delivery - $10.00</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
                Discount Code
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                label="Enter your code"
                margin="normal"
            />

            <hr className="my-4" />

            <Box display="flex" justifyContent="space-between" mb={5}>
                <Typography variant="h6" className="text-uppercase">
                    Total price
                </Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>

            <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ fontWeight: "bold", width: "100%" }}
            >
                Register
            </Button>
        </Box>
    );
};

export default Summary;
