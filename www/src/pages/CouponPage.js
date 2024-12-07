import React, { useState } from "react";
import { Box, Typography, Divider, List } from "@mui/material";
import CouponItem from "../components/coupon/CouponItem";
import ToastNoti from "../components/toast-noti/ToastNoti";

const CouponPage = () => {
    const [myCoupons, setMyCoupons] = useState([
        {
            id: 1,
            title: "10% Off Your Order",
            description: "Get 10% off on all items.",
            expiryDate: "2024-12-31",
        },
        {
            id: 2,
            title: "Free Shipping",
            description: "Enjoy free shipping for orders over $50.",
            expiryDate: "2024-11-30",
        },
    ]);

    const [availableCoupons, setAvailableCoupons] = useState([
        {
            id: 3,
            title: "Buy 1 Get 1 Free",
            description: "Applicable on select items.",
            expiryDate: "2024-12-15",
        },
        {
            id: 4,
            title: "20% Cashback",
            description: "Get 20% cashback on prepaid orders.",
            expiryDate: "2024-12-25",
        },
    ]);

    const [showToast, setShowToast] = useState(false); // State to control toast visibility

    const handleReceiveCoupon = (id) => {
        // Find the coupon from availableCoupons
        const couponToReceive = availableCoupons.find(coupon => coupon.id === id);
        
        // Remove the coupon from availableCoupons
        const updatedAvailableCoupons = availableCoupons.filter(coupon => coupon.id !== id);
        
        // Add the coupon to myCoupons
        setAvailableCoupons(updatedAvailableCoupons); // Update available coupons
        setMyCoupons(prevCoupons => [...prevCoupons, couponToReceive]); // Add coupon to myCoupons
        
        // Show the toast notification
        setShowToast(true);

        // Hide the toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <Box p={3} sx={{ minHeight: "80vh", maxWidth: "60%", margin: "5em auto 0.5em auto" }}>
            <Typography variant="h4" gutterBottom>
                My Coupons
            </Typography>
            <List>
                {myCoupons.map((coupon) => (
                    <CouponItem key={coupon.id} coupon={coupon} />
                ))}
            </List>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" gutterBottom>
                Available Coupons
            </Typography>
            <List>
                {availableCoupons.map((coupon) => (
                    <CouponItem
                        key={coupon.id}
                        coupon={coupon}
                        onReceive={handleReceiveCoupon} // Pass the function to handle coupon receive
                    />
                ))}
            </List>

            {/* Show Toast Notification */}
            {showToast && (
                <ToastNoti
                    message="Coupon received successfully!"
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Box>
    );
};

export default CouponPage;
