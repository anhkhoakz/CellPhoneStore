import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ToastNoti from "../ToastNoti";

const UserInfo = ({ user, onUserInfoChange }) => {
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		phone: "",
	});

	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success");

	const handleChange = (e) => {
		onUserInfoChange({ [e.target.name]: e.target.value });
	};

	const validate = () => {
		let valid = true;
		let errorMessages = {};

		// Kiểm tra tên
		if (!user.name) {
			errorMessages.name = "Name cannot be blank";
			valid = false;
		}

		// Kiểm tra email
		if (!user.email) {
			errorMessages.email = "Email cannot be blank";
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(user.email)) {
			errorMessages.email = "Email invalid";
			valid = false;
		}

		// Kiểm tra số điện thoại
		if (!user.phone) {
			errorMessages.phone = "Phone number cannot be blank";
			valid = false;
		} else if (!/^\d{10}$/.test(user.phone)) {
			errorMessages.phone = "Phone number must have 10 digits";
			valid = false;
		}

		// Cập nhật state lỗi
		setErrors(errorMessages);

		return valid;
	};

	const handleSaveChanges = () => {
		if (validate()) {
			setToastMessage("Information has been saved successfully!");
			setToastType("success");
		} else {
			setToastMessage("An error occurred while saving information.");
			setToastType("error");
		}

		setTimeout(() => {
			setToastMessage("");
		}, 3000);
	};

	return (
		<div>
			<Typography variant="h6">User Information</Typography>
			<TextField
				label="Name"
				name="name"
				value={user.name}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={!!errors.name}
				helperText={errors.name}
			/>
			<TextField
				label="Email"
				name="email"
				value={user.email}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={!!errors.email}
				helperText={errors.email}
			/>
			<TextField
				label="Phone number"
				name="phone"
				value={user.phone}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={!!errors.phone}
				helperText={errors.phone}
			/>

			<Button variant="contained" color="primary" style={{ marginTop: "1.25em" }} onClick={handleSaveChanges}>
				Save Changes
			</Button>

			{/* Display Toast Notification */}
			{toastMessage && (
				<ToastNoti message={toastMessage} type={toastType} position="top-right" autoClose={3000} />
			)}
		</div>
	);
};

export default UserInfo;
