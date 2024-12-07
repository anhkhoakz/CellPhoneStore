import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import LoggedCustomerInfo from "./LoggedCustomerInfo";
import CustomerInfo from "./CustomerInfo"; // Import CustomerInfo
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import ToastNoti from "../toast-noti/ToastNoti";

const Summary = ({ total, shipping, items }) => {
    const [name, setName] = useState("John Doe");
    const [phone, setPhone] = useState("+1 234 567 890");
    const [email, setEmail] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const [savedAddresses] = useState([
        "123 Main St, City A",
        "456 Oak St, City B",
        "789 Pine St, City C",
    ]);
    const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);


    const [shippingCost, setShippingCost] = useState(shipping);
    const [discountCode, setDiscountCode] = useState("");

    const [availableCoupons, setAvailableCoupons] = useState([""]);

    const [loyaltyPoints, setLoyaltyPoints] = useState(); // Example points
    const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

    const [cookies] = useCookies([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/loyalty`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.accessToken}`,
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                if (data.success) {
                    // Set loyalty points

                    console.log(data.message);
                    setLoyaltyPoints(data.message.pointsEarned);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [cookies.accessToken]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/coupons/my`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.accessToken}`,
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                if (data.success) {
                    // const descriptions = data.data.map(
                    //     (coupon) =>{
                    //         if(coupon.condition.minOrderValue < total && coupon.condition.applicableCategories.includes(items[0].category)){
                    //             return coupon.description
                    //         }
                    //     } 
                    // );


                    setAvailableCoupons(data.data);
                    // console.log(descriptions);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [cookies.accessToken]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const calculateTotal = () => {
        const discount = useLoyaltyPoints ? loyaltyPoints : 0;
        return Math.max(total + shippingCost - discount, 0);
    };

    const handleLoyaltySwitch = (event) => {
        
        setUseLoyaltyPoints(event.target.checked);
    };

    const handleCouponSelect = (e) => {
        setDiscountCode(e.target.value);
    };

    const handleSubmit = () => {
        console.log("Customer Information:", { name, phone, selectedAddress });
        console.log("Shipping:", shippingCost);
        console.log("Discount Code:", discountCode);
        console.log("Total Price:", total);
        console.log("Items:", items);

        if(useLoyaltyPoints){
            console.log("Loyalty Points used:", loyaltyPoints);
        }


        // fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/checkout`, {
        //     method: "POST",
        //     credentials: "include",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${cookies.accessToken}`,
        //     },
        //     body: JSON.stringify({
        //         couponCode: discountCode,
        //         shippingAddress: {
        //             street: "Street",
        //             city: "City",
        //             district: "District",
        //             village: "Village",
        //             detail: selectedAddress,
        //             phone,
        //             name,
        //         },
        //         items: items,
        //         email: email,
        //         shippingOption: shippingCost === 5 ? "standard" : "express",
        //         total,
        //     }),
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         if (data.success) {
        //             setToastType("success");
        //             setToastMessage("Order placed successfully!");
        //             navigate("/success");
        //         } else {
        //             setToastType("error");
        //             setToastMessage(data.message);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error("Error:", error);
        //     });
    };

    const handleToastReset = () => {
        setTimeout(() => setToastMessage(""), 3000);
    };

    // Check if the user is logged in
    const isLoggedIn = Boolean(cookies.accessToken);

    return (
        <Box className="p-5">
            {/* Show LoggedCustomerInfo if logged in, else show CustomerInfo */}
            {isLoggedIn ? (
                <LoggedCustomerInfo
                    name={name}
                    phone={phone}
                    setPhone={setPhone}
                    email={email}
                    setEmail={setEmail}
                    savedAddresses={savedAddresses}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                />
            ) : (
                <CustomerInfo
                    setName={setName}
                    setPhone={setPhone}
                    setAddress={setSelectedAddress}
                />
            )}

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
                        <MenuItem key={coupon.code} value={coupon.code}>
                            {coupon.code} - {coupon.description}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Loyalty Points Section */}
            <Typography variant="h6" gutterBottom>
                Loyalty Points
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="body1">
                    Available Points: {loyaltyPoints}
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            disabled={loyaltyPoints < 50000}
                            checked={useLoyaltyPoints}
                            onChange={handleLoyaltySwitch}
                            color="primary"

                        />
                    }
                    label="Use Loyalty Points"
                    labelPlacement="start"
                />
            </Box>

            <hr className="my-4" />

            <Box display="flex" justifyContent="space-between" mb={5}>
                <Typography variant="h6" className="text-uppercase">
                    Total price
                </Typography>
                <Typography variant="h6">
                    {formatPrice(calculateTotal().toFixed(2))}
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ fontWeight: "bold", width: "100%" }}
            >
                Register
            </Button>

            {toastMessage && (
                <ToastNoti
                    message={toastMessage}
                    type={toastType}
                    position="top-right"
                    autoClose={3000}
                    onClose={handleToastReset}
                />
            )}
        </Box>
    );
};

export default Summary;
