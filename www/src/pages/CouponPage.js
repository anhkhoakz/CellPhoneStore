import { Box, Divider, List, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CouponItem from "../components/coupon/CouponItem";
import ToastNoti from "../components/toast-noti/ToastNoti";

const CouponPage = () => {
    const [cookies, setCookie] = useCookies([]);

    const [myCoupons, setMyCoupons] = useState([]);

    const [availableCoupons, setAvailableCoupons] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/coupons/my`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                    },
                );

                const data = await response.json();
                console.log(data);

                if (data.success) {
                    setMyCoupons(data.data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchCoupons();
    }, [cookies.accessToken]);

    useEffect(() => {
        // Fetch available coupons from the server
        const fetchCoupons = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/coupons/available`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                    },
                );

                const data = await response.json();
                console.log(data);

                if (data.success) {
                    setAvailableCoupons(data.data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchCoupons();
    }, [cookies.accessToken]); // Ensure dependencies are correctly listed

    const [showToast, setShowToast] = useState(false); // State to control toast visibility

    const handleReceiveCoupon = (id) => {
        // Find the coupon from availableCoupons
        const couponToReceive = availableCoupons.find(
            (coupon) => coupon.code === id,
        );

        // Remove the coupon from availableCoupons
        const updatedAvailableCoupons = availableCoupons.filter(
            (coupon) => coupon.code !== id,
        );

        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/coupons/receive/${id}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.accessToken}`,
                },
            },
        )
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    console.error("Error:", data.message);
                    return;
                }

                setAvailableCoupons(updatedAvailableCoupons); // Update available coupons
                setMyCoupons((prevCoupons) => [
                    ...prevCoupons,
                    couponToReceive,
                ]); // Add coupon to myCoupons

                // Show the toast notification
                setShowToast(true);

                // Hide the toast after 3 seconds
                setTimeout(() => setShowToast(false), 3000);
            });
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
            {myCoupons.length > 0 ? (
                <List>
                    {myCoupons.map((coupon) => (
                        <CouponItem key={coupon.code} coupon={coupon} />
                    ))}
                </List>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    You don't have any coupons yet.
                </Typography>
            )}

            <Divider sx={{ my: 4 }} />

            <Typography variant="h4" gutterBottom>
                Available Coupons
            </Typography>
            <List>
                {availableCoupons.map((coupon) => (
                    <CouponItem
                        key={coupon.code}
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
