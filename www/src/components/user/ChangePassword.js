import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { useCookies } from "react-cookie";

const ChangePassword = ({ user, onPasswordChangeSuccess }) => {
    const [cookies] = useCookies([]);

    // State để lưu trữ giá trị các trường nhập liệu
    const [oldPassword, setOldPassword] = useState("");
    const [password, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // State để lưu trữ lỗi
    const [errors, setErrors] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });

    // State để kiểm tra ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        password: false,
        confirmPassword: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "oldPassword") setOldPassword(value);
        if (name === "password") setNewPassword(value);
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
        if (!oldPassword) {
            errorMessages.oldPassword = "Mật khẩu hiện tại không được để trống";
            valid = false;
        }

        // Kiểm tra mật khẩu mới
        if (!password) {
            errorMessages.password = "Mật khẩu mới không được để trống";
            valid = false;
        } else if (password.length < 6) {
            errorMessages.password = "Mật khẩu mới phải có ít nhất 6 ký tự";
            valid = false;
        }

        // Kiểm tra xác nhận mật khẩu mới
        if (!confirmPassword) {
            errorMessages.confirmPassword =
                "Xác nhận mật khẩu không được để trống";
            valid = false;
        } else if (confirmPassword !== password) {
            errorMessages.confirmPassword = "Xác nhận mật khẩu không khớp";
            valid = false;
        }

        // Cập nhật thông báo lỗi
        setErrors(errorMessages);

        return valid;
    };

    const changePassword = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${user._id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookies.accessToken}`,
                    },

                    body: JSON.stringify({
                        password: password,
                        oldPassword: oldPassword,
                        confirmPassword: confirmPassword,
                    }),
                },
            );

            const data = await response.json();
            console.log(data);
            return data.code;
        } catch (error) {
            console.error(error);
            return 503;
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            // Gọi hàm thay đổi mật khẩu
            const check = await changePassword();

            // Gọi hàm callback để đóng modal

            if (check === 200) {
                onPasswordChangeSuccess(); // Call the callback to close the modal
            }

            setErrors({ oldPassword: "Current password is incorrect" });
        }
    };

    return (
        <Box
            style={{ maxWidth: "500px", margin: "0px auto", minHeight: "35vh" }}
        >
            <TextField
                label="Enter Current Password"
                type={showPassword.oldPassword ? "text" : "password"}
                name="oldPassword"
                value={oldPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.oldPassword}
                helperText={errors.oldPassword}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() =>
                                    handleClickShowPassword("oldPassword")
                                }
                                edge="end"
                            >
                                {showPassword.oldPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                label="Enter New Password"
                type={showPassword.password ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() =>
                                    handleClickShowPassword("password")
                                }
                                edge="end"
                            >
                                {showPassword.password ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
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
                            <IconButton
                                onClick={() =>
                                    handleClickShowPassword("confirmPassword")
                                }
                                edge="end"
                            >
                                {showPassword.confirmPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Typography variant="body2" color="error">
                {errors.general}
            </Typography>

            <Box textAlign="center" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
};

export default ChangePassword;
