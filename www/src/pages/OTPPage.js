import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";
const OtpPage = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(true); // Flag to check if OTP is sent
    const navigate = useNavigate();

    const [cookies] = useCookies([]);

    // Handle OTP input change
    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        if (value === "" || /^[0-9]{1}$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to the next input field
            if (value !== "" && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    // Handle OTP submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length === 6) {
            console.log("OTP entered:", otpValue);

            const email = cookies.email; // Get email from cookies

            console.log("Email:", email);
            // Send OTP for verification
            fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/verifyAccount`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ otp: otpValue, email }),
                },
            )
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);

                    if (data.code === 201) {
                        console.log("OTP verified successfully");
                        navigate("/login");
                    } else {
                        console.log(data.message);
                        setErrorMessage(data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error verifying OTP:", error);
                    setErrorMessage("There was an error with OTP verification");
                });
        } else {
            setErrorMessage("Please enter the 6-digit OTP.");
        }
    };

    // Resend OTP
    const handleResendOtp = () => {
        // Trigger resend OTP logic here
        console.log("Resending OTP...");
        // Example:
        setIsOtpSent(false);
        setTimeout(() => {
            setIsOtpSent(true);
        }, 2000); // Simulate OTP resend success
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
                margin: "auto",
                minHeight: "80vh",
                justifyContent: "center", // Center vertically
                alignItems: "center", // Center horizontally
            }}
        >
            <Typography variant="h2" align="center" gutterBottom>
                Enter the OTP
            </Typography>

            {isOtpSent ? (
                <Typography variant="body2" align="center" gutterBottom>
                    A 6-digit OTP has been sent to your email. Please check your
                    inbox and enter the code below.
                </Typography>
            ) : (
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: red[500] }}
                    gutterBottom
                >
                    OTP resend failed. Please try again.
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    marginBottom: 2,
                }}
            >
                {otp.map((digit, index) => (
                    <TextField
                        key={index}
                        id={`otp-input-${index}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        inputProps={{ maxLength: 1 }}
                        variant="outlined"
                        size="small"
                        sx={{ width: "40px" }}
                    />
                ))}
            </Box>

            {errorMessage && (
                <Typography sx={{ color: red[500] }} align="center">
                    {errorMessage}
                </Typography>
            )}

            <Button variant="contained" type="submit" sx={{ marginBottom: 2 }}>
                Verify OTP
            </Button>

            <Link
                href="#"
                variant="body2"
                onClick={handleResendOtp}
                sx={{ alignSelf: "center", cursor: "pointer" }}
            >
                Resend OTP
            </Link>
        </Box>
    );
};

export default OtpPage;
