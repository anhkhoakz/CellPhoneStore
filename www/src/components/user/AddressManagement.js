import { Close } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import AddAddress from "./AddAddress";

const AddressManagement = ({
    addresses,
    onAddAddress,
    onSetDefaultAddress,
    onRemoveAddress,
}) => {
    const [open, setOpen] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState("");
    const [cookies] = useCookies([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Thiết lập địa chỉ mặc định khi component được render
    useEffect(() => {
        const defaultAddr = addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
            setDefaultAddress(defaultAddr._id);
            setSelectedAddress(defaultAddr);
        }
    }, [addresses]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDefaultAddressChange = (event) => {
        const selectedId = event.target.value;

        // Gửi yêu cầu API để thay đổi địa chỉ mặc định
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/setDefaultAddress/${selectedId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.accessToken}`,
                },
                credentials: "include",
            },
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // Cập nhật trạng thái địa chỉ mặc định
                    setDefaultAddress(selectedId);

                    // Cập nhật danh sách địa chỉ cục bộ
                    const updatedAddresses = addresses.map((addr) => ({
                        ...addr,
                        isDefault: addr._id === selectedId,
                    }));
                    onSetDefaultAddress(selectedId, updatedAddresses);

                    // Hiển thị thông tin địa chỉ mới
                    const selectedAddr = updatedAddresses.find(
                        (addr) => addr._id === selectedId,
                    );
                    setSelectedAddress(selectedAddr);
                }
            });
    };

    const handleRemoveAddress = (e, id) => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/removeAddress/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.accessToken}`,
                },
                credentials: "include",
            },
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    e.stopPropagation();
                    onRemoveAddress(id);
                }
            });
    };

    return (
        <div>
            <Typography variant="h6">Address management</Typography>
            <Typography variant="subtitle1">Select default address</Typography>
            <Select
                value={defaultAddress}
                onChange={handleDefaultAddressChange}
                fullWidth
            >
                {addresses.map((addr) => (
                    <MenuItem
                        key={addr._id}
                        value={addr._id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span>
                            {addr.detail} {addr.isDefault ? "(Default)" : ""}
                        </span>
                        {!addr.isDefault && (
                            <IconButton
                                onClick={(e) =>
                                    handleRemoveAddress(e, addr._id)
                                }
                                size="small"
                            >
                                <Close />
                            </IconButton>
                        )}
                    </MenuItem>
                ))}
            </Select>

            {selectedAddress && (
                <div style={{ marginTop: "20px" }}>
                    <Typography variant="subtitle1">
                        Contact Information
                    </Typography>
                    <Typography variant="body2">
                        <strong>Name:</strong> {selectedAddress.receiver}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Phone:</strong> {selectedAddress.phone}
                    </Typography>
                </div>
            )}

            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "1.25em" }}
                onClick={handleClickOpen}
            >
                Add new address
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add new address</DialogTitle>
                <DialogContent>
                    <AddAddress
                        onAddAddress={onAddAddress}
                        onClose={handleClose}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddressManagement;
