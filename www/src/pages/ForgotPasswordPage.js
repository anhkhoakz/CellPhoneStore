import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailForm from "../components/forgot-password/EmailForm";
import Notification from "../components/forgot-password/Notification";

const ForgotPasswordPage = () => {
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleBackToVerify = () => {
        navigate("/verify");
    };

    const handleEmailSent = () => {
        setEmailSent(true);
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", padding: 3, minHeight: "80vh" }}>
            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
                Forgot Password
            </Typography>
            {!emailSent ? (
                <EmailForm onEmailSent={handleEmailSent} />
            ) : (
                <Notification
                    message="A password reset link has been sent to your email."
                    onBackToLogin={handleBackToVerify}
                />
            )}
        </Box>
    );
};

export default ForgotPasswordPage;
