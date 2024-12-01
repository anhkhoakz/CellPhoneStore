import * as React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

export default function LockReasonDialog({ open, onClose, onSave }) {
	const [reason, setReason] = React.useState("");

	const handleSave = () => {
		onSave(reason);
		setReason("");
		onClose();
	};

	const handleClose = () => {
		setReason("");
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Nhập lý do khóa tài khoản</DialogTitle>
			<DialogContent>
				<TextField
					margin="dense"
					label="Lý do khóa tài khoản"
					type="text"
					fullWidth
					value={reason}
					onChange={(e) => setReason(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					Hủy
				</Button>
				<Button onClick={handleSave} color="primary" variant="contained" disabled={!reason.trim()}>
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}
