import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import UserInfo from "../components/user/UserInfo";
import AddressManagement from "../components/user/AddressManagement";
import ChangePassword from "../components/user/ChangePassword";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ToastNoti from "../components/toast-noti/ToastNoti"; // Import ToastNoti

import { useCookies } from "react-cookie";

const UserProfilePage = () => {

    const [cookies] = useCookies([]);
    const [user, setUser] = useState({});


    useEffect(() => {
        // Fetch user data from the server

         const fetchUserData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${cookies.userId}`, 
                        { 
                            method: "GET",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${cookies.accessToken}`,
                            },
                        });

                    if (response.ok) {
                        const userData = await response.json();
                        console.log(userData);
                        setUser(userData.message);
                    } else {
                        throw new Error("Failed to fetch user data");
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchUserData();
    }
    , []);

    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "", show: false });

    const handleUserInfoChange = (updatedUserInfo) => {
        setUser((prevUser) => ({ ...prevUser, ...updatedUserInfo }));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddAddress = (newAddress) => {
        setUser((prevUser) => ({
            ...prevUser,
            addresses: [
                ...prevUser.addresses,
                {
                    id: prevUser.addresses.length + 1,
                    isDefault: false,
                    ...newAddress,
                },
            ],
        }));
        setToast({
            message: "The address has been added successfully!",
            type: "success",
            show: true,
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000); // Hide toast after 3 seconds
    };

    const handleSetDefaultAddress = (id) => {
        setUser((prevUser) => ({
            ...prevUser,
            addresses: prevUser.addresses.map((addr) =>
                addr.id === id
                    ? { ...addr, isDefault: true }
                    : { ...addr, isDefault: false },
            ),
        }));
        setToast({
            message: "The default address has been changed!",
            type: "success",
            show: true,
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000); // Hide toast after 3 seconds
    };

    // Handle address removal
    const handleRemoveAddress = (id) => {
        setUser((prevUser) => ({
            ...prevUser,
            addresses: prevUser.addresses.filter((addr) => addr.id !== id),
        }));
        setToast({
            message: "The address has been successfully deleted!",
            type: "success",
            show: true,
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000); // Hide toast after 3 seconds
    };


    const handlePasswordChangeSuccess = () => {
        setOpen(false); // Close modal
        setToast({
            message: "Password changed successfully!",
            type: "success",
            show: true,
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000); // Hide toast after 3 seconds
    };

    return (
        <Grid
            container
            spacing={3}
            style={{ minHeight: "100vh" }}
            justifyContent="center"
            alignItems="center"
            direction="column"
            sx={{ marginTop: "6em" }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{fontWeight: "bold"}}>
                User Profile
            </Typography>

            <Grid item xs={12} md={6}>
                <Paper
                    elevation={3}
                    sx={{ padding: "1.25em", width: "80vh", maxWidth: "80vh" }}
                >
                    <UserInfo
                        user={user}
                        onUserInfoChange={handleUserInfoChange}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClickOpen}
                        sx={{ marginTop: "1.25em" }}
                    >
                        Change Password
                    </Button>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6} mb={2}>
                <Paper
                    elevation={3}
                    sx={{ padding: "1.25em", width: "80vh", maxWidth: "80vh" }}
                >
                    <AddressManagement
                        addresses={user.addresses || []}
                        onAddAddress={handleAddAddress}
                        onSetDefaultAddress={handleSetDefaultAddress}
                        onRemoveAddress={handleRemoveAddress}
                    />
                </Paper>
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <ChangePassword
                        user={user}
                        onPasswordChangeSuccess={handlePasswordChangeSuccess}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Hiển thị Toast khi lưu thành công */}
            {toast.show && (
                <ToastNoti
                    message={toast.message}
                    type={toast.type}
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Grid>
    );
};

export default UserProfilePage;
