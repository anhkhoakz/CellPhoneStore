import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Notification = ({ message, onBackToLogin }) => {
    return (
        <Box>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {message}
            </Typography>
            <Button variant="contained" fullWidth onClick={onBackToLogin}>
                Back to Login
            </Button>
        </Box>
    );
};

export default Notification;
