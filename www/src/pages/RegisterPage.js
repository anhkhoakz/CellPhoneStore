// src/pages/RegisterPage.js
import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import Register from "../components/Register";
import GoogleLogin from "../components/GoogleLogin";

const RegisterPage = () => {
	return (
		<Box sx={{ padding: 3, minHeight: "85vh" }}>
			<Typography style={{ margin: "1.25em 0" }} variant="h3" align="center">
				Sign Up
			</Typography>
			<GoogleLogin />
			<Divider sx={{ margin: 2 }}>Or</Divider>
			<Register />
		</Box>
	);
};

export default RegisterPage;
