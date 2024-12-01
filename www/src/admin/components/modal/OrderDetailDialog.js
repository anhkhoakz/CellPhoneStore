import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import OrderItem from "../../../components/OrderItem";

const OrderDetailDialog = ({ open, onClose, order }) => {
    const { customerName, orderDate, orderStatus, totalAmount, note, items } =
        order;

    console.log(order);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    <strong>Customer Name:</strong> {customerName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Order Date:</strong> {orderDate}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {orderStatus}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Note:</strong> {note || "No additional note"}
                </Typography>

                {/* Order Items */}
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 2, mt: 2 }}
                >
                    Order Items
                </Typography>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 2,
                                padding: 1,
                                border: "1px solid #e0e0e0",
                                borderRadius: 1,
                            }}
                        >
                            <OrderItem product={item} />
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No items available
                    </Typography>
                )}
                <DialogTitle>Total Amout: $ {totalAmount}</DialogTitle>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailDialog;
