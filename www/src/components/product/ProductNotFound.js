import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Import icon từ Material-UI
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom"; // Để điều hướng trở lại

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
                color: "#721c24",
                textAlign: "center",
                border: "1px solid #f5c6cb",
                borderRadius: "10px",
                padding: "1.25em",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                marginTop: "4em",
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 80, mb: 2, color: "#721c24" }} />
            <Typography variant="h4" sx={{ mb: 1 }}>
                Product Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                The product you're looking for does not exist or has been
                removed.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
                sx={{ mt: 2 }}
            >
                Go Back to Products
            </Button>
        </Box>
    );
};

export default NotFound;
