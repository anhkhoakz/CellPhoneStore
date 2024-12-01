import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Confirm = ({ open, message, onClose, onConfirm }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Xác nhận</DialogTitle>
			<DialogContent>
				<Typography>{message}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={onConfirm} color="primary">
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Confirm;
