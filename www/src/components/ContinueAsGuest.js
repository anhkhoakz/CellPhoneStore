import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function ContinueAsGuest() {
	return (
		<Box display="flex" flexDirection="column" alignItems="center" mt={4} width="100%">
			<Typography variant="h4" gutterBottom>
				Continue as a guest
			</Typography>
			<Button variant="outlined" fullWidth sx={{ maxWidth: 400 }} component={Link} to="/">
				Continue
			</Button>
		</Box>
	);
}

export default ContinueAsGuest;
