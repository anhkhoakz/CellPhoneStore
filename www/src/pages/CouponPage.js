import { Box, Divider, List, Typography } from "@mui/material";
import React, { useState } from "react";
import CouponItem from "../components/coupon/CouponItem";

const CouponPage = () => {
    const [myCoupons] = useState([
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

    const [availableCoupons] = useState([
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

    const handleReceiveCoupon = (id) => {
        console.log(`Coupon with ID ${id} received!`);
    };

    return (
        <Box
            p={3}
            sx={{
                minHeight: "80vh",
                maxWidth: "60%",
                margin: "5em auto 0.5em auto",
            }}
        >
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
                        onReceive={handleReceiveCoupon}
                    />
                ))}
            </List>
        </Box>
    );
};

export default CouponPage;
