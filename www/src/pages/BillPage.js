import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, Button, Divider } from "@mui/material";

const BillPage = () => {
    const location = useLocation();
    const order = location.state?.order; // Lấy dữ liệu từ state

    if (!order) {
        return <Typography>No order data provided</Typography>;
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <Box sx={{ padding: 3, minHeight: "80vh", marginTop: "5em" }}>
            <Typography variant="h4" gutterBottom sx={{fontWeight:",bold"}}>
                Bill for Order #{order._id}
            </Typography>
            <Card variant="outlined" sx={{ marginBottom: 2, maxWidth:"60%", margin:"2em auto" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Customer Information</Typography>
                    <Typography><strong>Name:</strong> {order.shippingAddress.name}</Typography>
                    <Typography><strong>Phone:</strong> {order.shippingAddress.phone}</Typography>
                    <Typography><strong>Address:</strong> {`${order.shippingAddress.detail}, ${order.shippingAddress.village}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`}</Typography>
                </CardContent>
            </Card>

            {/* Các chi tiết đơn hàng */}
            <Card variant="outlined" sx={{ marginBottom: 2, maxWidth:"60%", margin:"auto" }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Order Details</Typography>
                    {order.items.map((item, index) => (
                        <Box key={item._id} sx={{ marginBottom: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: "100%", maxHeight: "150px", objectFit: "contain" }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography><strong>{item.name}</strong></Typography>
                                    <Typography>Quantity: {item.quantity}</Typography>
                                </Grid>
                                <Grid item xs={4} sx={{ textAlign: "right" }}>
                                    <Typography>{formatPrice(item.price * item.quantity)}</Typography>
                                </Grid>
                            </Grid>
                            {index < order.items.length - 1 && <Divider />}
                        </Box>
                    ))}

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Amount</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>{formatPrice(order.totalAmount)}</Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Nút in hóa đơn */}
            <Box sx={{  margin:"2em auto", textAlign:"center" }}>
                <Button variant="contained" color="primary"  onClick={() => window.print()}>
                    Print Bill
                </Button>
            </Box>
        </Box>
    );
};

export default BillPage;
