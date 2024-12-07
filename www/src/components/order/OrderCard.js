import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
    FormHelperText, // Import FormHelperText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrderItem from "./OrderItem";
import ToastNoti from "../toast-noti/ToastNoti"; // Import ToastNoti


const OrderCard = ({ order }) => {
    const navigate = useNavigate(); // Hook để điều hướng
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // Điều khiển mở/đóng modal
    const [cancelReason, setCancelReason] = useState(""); // Lý do huỷ đơn hàng
    const [customReason, setCustomReason] = useState(""); // Lý do tuỳ chỉnh (nếu có)
    const [orderToCancel, setOrderToCancel] = useState(null); // Lưu trữ đơn hàng cần huỷ
    const [errorMessage, setErrorMessage] = useState(""); // Lưu trữ thông báo lỗi

    const handleRateOrder = () => {
        console.log(`Navigating to rating page for Order ID: ${order._id}`);
        navigate(`/rating?orderId=${order._id}`);
    };

    const handleCancelOrder = () => {
        setOrderToCancel(order); // Lưu thông tin đơn hàng cần huỷ
        setIsConfirmDialogOpen(true); // Mở modal xác nhận huỷ
        setErrorMessage(""); // Reset lỗi khi mở modal
    };

    const handleConfirmCancel = () => {
        if (!orderToCancel || !cancelReason) {
            setErrorMessage("Please select a reason for cancellation."); // Hiển thị thông báo lỗi
            return;
        }

        setToastMessage("Order canceled successfully!");
        setToastType("success");

        // Gửi yêu cầu huỷ đơn hàng với lý do
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/cancel/${orderToCancel._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reason: cancelReason,
                customReason: customReason,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                if (data.success) {
                    orderToCancel.status = "cancelled";
                    console.log("Order Cancelled");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                setIsConfirmDialogOpen(false);
                setCancelReason("");
                setCustomReason("");
            });
    };

    const handleCancelDialogClose = () => {
        setIsConfirmDialogOpen(false);
        setCancelReason("");
        setCustomReason("");
        setErrorMessage(""); // Reset lỗi khi đóng modal
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    return (
        <>
            <Card variant="outlined" sx={{ marginBottom: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                        Order #{order._id}
                    </Typography>
                    <Typography color="textSecondary" sx={{ marginBottom: 2 }}>
                        Order Date: {order.createdAt}
                    </Typography>

                    {order.items.map((product, index) => (
                        <React.Fragment key={index}>
                            <OrderItem product={product} />
                            {index < order.items.length - 1 && <Divider sx={{ marginY: 2 }} />}
                        </React.Fragment>
                    ))}

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Total: {formatPrice(order.totalAmount)}
                        </Typography>

                        {/* Nút "Rate Order" chỉ hiển thị nếu trạng thái là "delivered" */}
                        {order.status === "delivered" && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRateOrder}
                                disabled={order.isRating}
                            >
                                {!order.isRating ? "Rate Order" : "Rated"}
                            </Button>
                        )}
                        {/* Nút "Cancel" chỉ hiển thị nếu trạng thái là "pending" */}
                        {(order.status === "pending" || order.status === "confirmed") && (
                            <Button variant="outlined" color="error" onClick={handleCancelOrder}>
                                Cancel Order
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>


            <Dialog open={isConfirmDialogOpen} onClose={handleCancelDialogClose} maxWidth="xs" fullWidth>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Select a reason for cancellation</FormLabel>
                        <RadioGroup
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <FormControlLabel value="No longer needed" control={<Radio />} label="No longer needed" />
                            <FormControlLabel value="Bought elsewhere" control={<Radio />} label="Bought elsewhere" />
                            <FormControlLabel value="Wrong address" control={<Radio />} label="Wrong address" />
                            <FormControlLabel value="Changed my mind" control={<Radio />} label="Changed my mind" />
                            <FormControlLabel value="Other" control={<Radio />} label="Other" />
                        </RadioGroup>

                        {cancelReason === "Other" && (
                            <TextField
                                label="Please specify"
                                variant="outlined"
                                fullWidth
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                sx={{ marginTop: 2 }}
                            />
                        )}

                        {errorMessage && (
                            <FormHelperText error>{errorMessage}</FormHelperText> // Hiển thị lỗi dưới cùng
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmCancel} color="primary">
                        Confirm Cancellation
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Display Toast Notification */}
            {toastMessage && (
                <ToastNoti
                    message={toastMessage}
                    type={toastType}
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </>
    );
};

export default OrderCard;
