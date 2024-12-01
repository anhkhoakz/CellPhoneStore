import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePassword = ({ user, onPasswordChangeSuccess }) => {
	// State để lưu trữ giá trị các trường nhập liệu
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// State để lưu trữ lỗi
	const [errors, setErrors] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// State để kiểm tra ẩn/hiện mật khẩu
	const [showPassword, setShowPassword] = useState({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "currentPassword") setCurrentPassword(value);
		if (name === "newPassword") setNewPassword(value);
		if (name === "confirmPassword") setConfirmPassword(value);
	};

	const handleClickShowPassword = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	const validate = () => {
		let valid = true;
		let errorMessages = {};

		// Kiểm tra mật khẩu hiện tại
		if (!currentPassword) {
			errorMessages.currentPassword = "Mật khẩu hiện tại không được để trống";
			valid = false;
		}

		// Kiểm tra mật khẩu mới
		if (!newPassword) {
			errorMessages.newPassword = "Mật khẩu mới không được để trống";
			valid = false;
		} else if (newPassword.length < 6) {
			errorMessages.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
			valid = false;
		}

		// Kiểm tra xác nhận mật khẩu mới
		if (!confirmPassword) {
			errorMessages.confirmPassword = "Xác nhận mật khẩu không được để trống";
			valid = false;
		} else if (confirmPassword !== newPassword) {
			errorMessages.confirmPassword = "Xác nhận mật khẩu không khớp";
			valid = false;
		}

		// Cập nhật thông báo lỗi
		setErrors(errorMessages);

		return valid;
	};

	const handleSubmit = () => {
		if (validate()) {
			console.log("Mật khẩu đã được thay đổi thành công!");
			onPasswordChangeSuccess(); // Call the callback to close the modal
		}
	};

	return (
		<Box style={{ maxWidth: "500px", margin: "0px auto", minHeight: "35vh" }}>
			<TextField
				label="Enter Current Password"
				type={showPassword.currentPassword ? "text" : "password"}
				name="currentPassword"
				value={currentPassword}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={!!errors.currentPassword}
				helperText={errors.currentPassword}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={() => handleClickShowPassword("currentPassword")} edge="end">
								{showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<TextField
				label="Enter New Password"
				type={showPassword.newPassword ? "text" : "password"}
				name="newPassword"
				value={newPassword}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={!!errors.newPassword}
				helperText={errors.newPassword}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={() => handleClickShowPassword("newPassword")} edge="end">
								{showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<TextField
				label="Confirm new password"
				type={showPassword.confirmPassword ? "text" : "password"}
				name="confirmPassword"
				value={confirmPassword}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={!!errors.confirmPassword}
				helperText={errors.confirmPassword}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={() => handleClickShowPassword("confirmPassword")} edge="end">
								{showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
			<Box textAlign="center" mt={2}>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					Save
				</Button>
			</Box>
		</Box>
	);
};

export default ChangePassword;
