import React from "react";
import { Typography, Box } from "@mui/material";
import PayPalLogo from "../../assets/image/paypal.png";

const ExpressCheckout = () => {
    return (
        <Box className="p-5" textAlign="center">
            <Typography variant="h5" component="h3" gutterBottom>
                Express Checkout
            </Typography>

            <img
                src={PayPalLogo}
                alt="PayPal Logo"
                style={{ width: "11.25em" }}
            />
        </Box>
    );
};

export default ExpressCheckout;
