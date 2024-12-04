import React, { useState } from "react";
import { Box, TextField, Button , Typography} from "@mui/material";


const EnterPasswordForm = ({ token, onSuccess }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        
        // Mock API call to reset the password
        try {
            // Replace with actual API call

            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/resetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, confirmPassword, token }),

            })
                .then((res) => res.json())

                .then((data) => {
                    if (data.code === 200) {
                        console.log("Reset password for token:", token);
                        onSuccess(); // Trigger success action
                    } else {
                        setError(data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setError("Failed to reset password. Please try again.");
                });
        } catch (err) {
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary">
                Reset Password
            </Button>
        </Box>
    );
};

export default EnterPasswordForm;
