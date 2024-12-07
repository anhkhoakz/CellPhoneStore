import { Box, Button, Typography } from "@mui/material"; // Import các thành phần Material-UI
import React from "react";
import { Link } from "react-router-dom";

const OrderEmpty = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
                color: "#155724",
                textAlign: "center",
                borderRadius: "10px",
                padding: "1.25em",
            }}
        >
            <Typography variant="h4" sx={{ mb: 1, marginTop: 5 }}>
                There are no orders here!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#6c757d" }}>
                Sorry, we currently have no orders found!
            </Typography>
            <Box
                component="img"
                src="/image/empty-box.png"
                alt="order-empty"
                sx={{ width: "250px", height: "auto", mb: 3 }}
            />
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/"
                sx={{
                    color: "white",
                    padding: "10px 1.25em",
                    borderRadius: "5px",
                    textDecoration: "none",
                }}
            >
                Go back to products
            </Button>
        </Box>
    );
};

export default OrderEmpty;
