import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const CartEmpty = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "81vh", textAlign: "center" }}
        >
            <ShoppingCartOutlinedIcon
                sx={{ fontSize: 100, color: "grey.400", mb: 2 }}
            />
            <Typography variant="h4" gutterBottom color="textSecondary">
                Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Looks like you haven&apos;t added anything to your cart yet.
            </Typography>
            <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
            >
                Go back to products
            </Button>
        </Box>
    );
};

export default CartEmpty;
