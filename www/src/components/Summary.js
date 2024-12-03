// src/components/Summary.js
import React, { useState } from "react";
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Box,
} from "@mui/material";
import LoggedCustomerInfo from "./LoggedCustomerInfo"; // Import LoggedCustomerInfo

const Summary = ({ subtotal, total, shipping, setShipping, items }) => {
    // Customer state
    const [name] = useState("John Doe"); // Example name (read-only)
    const [phone, setPhone] = useState("+1 234 567 890"); // Example phone number (editable)
    const [savedAddresses] = useState([
        "123 Main St, City A",
        "456 Oak St, City B",
        "789 Pine St, City C",
    ]); // Example list of saved addresses
    const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]); // Default selected address

    // Shipping state
    const [shippingCost, setShippingCost] = useState(shipping);

    const handleSubmit = () => {
        console.log("Customer Information:", { name, phone, selectedAddress });
        console.log("Shipping:", shippingCost);
        console.log("Total Price:", total);

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/checkout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                couponCode: "",
                shippingAddress: {
                    street: "Street",
                    city: "City",
                    district: "District",
                    village: "Village",
                    detail: selectedAddress,
                },
                items: items,
                email: "khanhmh2004@gmail.com",
                phone,
                name,
                shippingOption: shippingCost === 5 ? "standard" : "express",
                total,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    };

    return (
        <Box className="p-5">
            {/* Logged customer info */}
            <LoggedCustomerInfo
                name={name}
                phone={phone}
                setPhone={setPhone}
                savedAddresses={savedAddresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
            />

            <hr className="my-4" />

            {/* Summary Section */}
            <Typography variant="h5" component="h3" gutterBottom>
                Summary
            </Typography>

            <Typography variant="h6" gutterBottom>
                Shipping
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Delivery Method</InputLabel>
                <Select
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
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
                // href="/success"
            >
                Register
            </Button>
        </Box>
    );
};

export default Summary;
