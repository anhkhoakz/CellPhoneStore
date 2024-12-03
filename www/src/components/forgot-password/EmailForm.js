import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";

const EmailForm = ({ onEmailSent }) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setEmailError("");
        setErrorMessage("");

        // Validate email format
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        // Simulate API call to send reset link
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === 200) {
                    onEmailSent(); // Send email successfully
                } else {
                    setErrorMessage(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setErrorMessage("There was an error sending the reset email.");
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Enter your email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                error={!!emailError}
                helperText={emailError}
                sx={{ marginBottom: 2 }}
            />
            {errorMessage && (
                <Typography sx={{ color: red[500], marginBottom: 2 }}>
                    {errorMessage}
                </Typography>
            )}
            <Button variant="contained" type="submit" fullWidth>
                Send Reset Link
            </Button>
        </form>
    );
};

export default EmailForm;
