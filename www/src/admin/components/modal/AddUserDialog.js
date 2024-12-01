// AddUserDialog.js
import * as React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

export default function AddUserDialog({ open, onClose, onSave }) {
	const [name, setName] = React.useState("");
	const [phoneNumber, setPhoneNumber] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [userStatus, setUserStatus] = React.useState("Hoạt động");

	const handleSave = () => {
		const newUser = { name, phoneNumber, address, userStatus };
		onSave(newUser);
		handleClose();
	};

	const handleClose = () => {
		setName("");
		setPhoneNumber("");
		setAddress("");
		setUserStatus("Hoạt động");
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Thêm Người Dùng Mới</DialogTitle>
			<DialogContent>
				<TextField
					margin="dense"
					label="Tên"
					type="text"
					fullWidth
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					margin="dense"
					label="Số điện thoại"
					type="text"
					fullWidth
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
				/>
				<TextField
					margin="dense"
					label="Địa chỉ"
					type="text"
					fullWidth
					value={address}
					onChange={(e) => setAddress(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					Hủy
				</Button>
				<Button onClick={handleSave} color="primary" variant="contained">
					Lưu
				</Button>
			</DialogActions>
		</Dialog>
	);
}
