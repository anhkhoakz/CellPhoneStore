import React, { useState } from "react";
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Box,
} from "@mui/material";
import LoggedCustomerInfo from "./LoggedCustomerInfo";

import { useCookies } from "react-cookie";

const Summary = ({ subtotal, total, shipping, setShipping, items }) => {
    // Customer state
    const [name] = useState("John Doe");
    const [phone, setPhone] = useState("+1 234 567 890");
    const [savedAddresses] = useState([
        "123 Main St, City A",
        "456 Oak St, City B",
        "789 Pine St, City C",
    ]);

    const [cookies] = useCookies([]);
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };
    const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
    

    // Shipping state
    const [shippingCost, setShippingCost] = useState(shipping);

    // Discount Code State
    const [discountCode, setDiscountCode] = useState("");
    const [availableCoupons] = useState(["DISCOUNT10", "FREESHIP", "SUMMER2023"]); // Available coupons

    const handleSubmit = () => {
        console.log("Customer Information:", { name, phone, selectedAddress });
        console.log("Shipping:", shippingCost);
        console.log("Discount Code:", discountCode);
        console.log("Total Price:", total);
        console.log("Items:", items);

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/checkout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.accessToken}`,
            },
            body: JSON.stringify({
                couponCode: discountCode,
                shippingAddress: {
                    street: "Street",
                    city: "City",
                    district: "District",
                    village: "Village",
                    detail: selectedAddress,
                    phone,
                    name,
                },
                items: items,
                email: "khanhmh2004@gmail.com",
                
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

    const handleCouponSelect = (e) => {
        setDiscountCode(e.target.value); // Update the discount code when selecting a coupon
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
                    <MenuItem value={5}>Standard Delivery - 5 ₫ </MenuItem>
                    <MenuItem value={10}>Express Delivery - 10 ₫</MenuItem>
                </Select>
            </FormControl>

            {/* Discount Code Section */}
            <Typography variant="h6" gutterBottom>
                Discount Code
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Coupon</InputLabel>
                <Select
                    value={discountCode}
                    onChange={handleCouponSelect}
                    label="Select Coupon"
                >
                    <MenuItem value="">None</MenuItem>
                    {availableCoupons.map((coupon) => (
                        <MenuItem key={coupon} value={coupon}>
                            {coupon}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Customer Point Section */}
            <Typography variant="h6" gutterBottom>
                Loyalty Points
            </Typography>
            

            <hr className="my-4" />

            <Box display="flex" justifyContent="space-between" mb={5}>
                <Typography variant="h6" className="text-uppercase">
                    Total price
                </Typography>
                <Typography variant="h6">{formatPrice(total.toFixed(2))}</Typography>
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
