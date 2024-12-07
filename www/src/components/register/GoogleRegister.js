import { Google as GoogleIcon } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

const GoogleRegister = () => {
    const handleGoogleRegister = () => {
        console.log("Đăng ký bằng Google");
        // Xử lý đăng ký bằng Google ở đây
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button
                variant="contained"
                onClick={handleGoogleRegister}
                startIcon={<GoogleIcon />}
                sx={{
                    backgroundColor: "red",
                    color: "white",
                    width: 400,
                    "&:hover": {
                        backgroundColor: "darkred",
                    },
                }}
            >
                Sign Up With Google
            </Button>
        </Box>
    );
};

export default GoogleRegister;
