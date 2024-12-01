// src/pages/LoginPage.js
import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import Login from "../components/Login";
import GoogleLogin from "../components/GoogleLogin";
import ContinueAsGuest from "../components/ContinueAsGuest";
// import { Cookie } from '@mui/icons-material';

import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";

import { useEffect } from "react";

const LoginPage = () => {
	const [cookies, setCookie] = useCookies([]);
	const navigate = useNavigate();

	useEffect(() => {
		console.log("Cookies:", cookies);

		if (cookies.userId) {
			console.log("User is logged in, redirecting...");
			navigate("/");
		}
	}, [cookies.userId]);

	return (
		<Box sx={{ padding: 3, minHeight: "85vh" }}>
			<Typography style={{ margin: "1.25em 0" }} variant="h3" align="center">
				Sign In
			</Typography>
			<GoogleLogin />
			<Divider sx={{ margin: 2 }}>Or</Divider>
			<Login />
			<ContinueAsGuest />
		</Box>
	);
};

export default LoginPage;
