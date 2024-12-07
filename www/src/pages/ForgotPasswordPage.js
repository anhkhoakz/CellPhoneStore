import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import EmailForm from "../components/forgot-password/EmailForm";
import Notification from "../components/forgot-password/Notification";
import EnterPasswordForm from "../components/forgot-password/EnterPasswordForm";

const ForgotPasswordPage = () => {
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const {token} = useParams();

    
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/checkValidToken/${token}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if(response.status !== 200) {
                    navigate("/Error404");
                }

                // print data
                const data = await response.json();
                console.log(data);


            } catch (error) {
                console.error("Error validating token:", error);
                navigate("/Error404");
            }
        };

        if (token) {
            validateToken();
        }
    }, [token, navigate]); 


    const handleBackToLogin = () => {
        navigate("/login"); // Redirect back to login
    };

    const handleEmailSent = () => {
        
        setEmailSent(true);
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "5em auto auto auto", padding: 3, minHeight: "80vh" }}>
            <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
                {token ? "Reset Your Password" : "Forgot Password"}
            </Typography>
            {token ? (
                // If a token exists, render the password reset form
                <EnterPasswordForm token={token} onSuccess={handleBackToLogin} />
            ) : (
                // Otherwise, render the email form or notification
                !emailSent ? (
                    <EmailForm onEmailSent={handleEmailSent} />
                ) : (
                    <Notification
                        message="A password reset link has been sent to your email."
                        onBackToLogin={handleBackToLogin}
                    />
                )
            )}
        </Box>
    );
};

export default ForgotPasswordPage;
