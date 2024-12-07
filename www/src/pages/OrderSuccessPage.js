import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const OrderSuccessPage = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
                color: "#155724",
                textAlign: "center",
                border: "1px solid #c3e6cb",
                borderRadius: "10px",
                padding: 4,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Purchase successful!
            </Typography>
            <Typography variant="body1" paragraph>
                Thank you for your purchase. Your order will be shipped soon!
            </Typography>
            <Box
                component="img"
                src="/image/car.png"
                alt="success"
                sx={{
                    marginTop: "1.25em",
                    width: "250px",
                    height: "auto",
                    mb: 3,
                }}
            />
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    marginTop: 3,
                }}
            >
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    sx={{
                        backgroundColor: "#28a745",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#218838",
                        },
                        padding: "10px 1.25em",
                    }}
                >
                    Go back to products
                </Button>

                <Button
                    component={Link}
                    to="/invoice"
                    variant="contained"
                    color="primary"
                    sx={{
                        padding: "10px 1.25em",
                    }}
                >
                    View Invoice
                </Button>
                <Button
                    component={Link}
                    to="/orderManagement"
                    variant="contained"
                    color="primary"
                    sx={{
                        padding: "10px 1.25em",
                    }}
                >
                    Order Management
                </Button>
            </Box>
        </Box>
    );
};

export default OrderSuccessPage;
