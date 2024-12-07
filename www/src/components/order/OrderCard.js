import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import OrderItem from "./OrderItem";

const OrderCard = ({ order }) => {
    const navigate = useNavigate(); // Hook để điều hướng

    const handleRateOrder = () => {
        console.log(`Navigating to rating page for Order ID: ${order._id}`);
        // Chuyển hướng đến trang rating kèm theo mã đơn hàng
        navigate(`/rating?orderId=${order._id}`);
    };

    const handleCancelOrder = () => {
        console.log(`Cancelling Order ID: ${order._id}`);
        // Thêm logic để huỷ đơn hàng
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/cancel/${order._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                if (data.success) {
                    // Nếu huỷ đơn hàng thành công, cập nhật lại trạng thái
                    order.status = "cancelled";
                    console.log("Order Cancelled");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            }
        );


    };

    return (
        <Card
            variant="outlined"
            sx={{ marginBottom: 2, borderRadius: 3, boxShadow: 2 }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#3f51b5" }}
                >
                    Order #{order._id}
                </Typography>
                <Typography color="textSecondary" sx={{ marginBottom: 2 }}>
                    Order Date: {order.createdAt}
                </Typography>

                {order.items.map((product, index) => (
                    <React.Fragment key={index}>
                        <OrderItem product={product} />
                        {index < order.items.length - 1 && (
                            <Divider sx={{ marginY: 2 }} />
                        )}
                    </React.Fragment>
                ))}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Total: ${order.totalAmount}
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
                    {(order.status === "pending" || order.status === "confirmed")&& (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCancelOrder}
                        >
                            Cancel Order
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
