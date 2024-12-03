import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ToastNoti from "../ToastNoti";
import { useCookies } from "react-cookie";

const UserInfo = ({ user, onUserInfoChange }) => {
    const [cookie] = useCookies([]);
    const [errors, setErrors] = useState({
        username: "",
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
        if (!user.username) {
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

    const saveUserInfo = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${user._id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie.accessToken}`,
                    },

                    body: JSON.stringify({
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                throw new Error("Failed to save user information");
            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleSaveChanges = async () => {
        if (validate()) {
            // Gửi request lưu thông tin
            await saveUserInfo();

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
                value={user.username}
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

            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "1.25em" }}
                onClick={handleSaveChanges}
            >
                Save Changes
            </Button>

            {/* Display Toast Notification */}
            {toastMessage && (
                <ToastNoti
                    message={toastMessage}
                    type={toastType}
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </div>
    );
};

export default UserInfo;
