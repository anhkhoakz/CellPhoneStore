import React from "react";
import {
    Card,
    CardContent,
    Button,
    Divider,
    Typography,
    Box,
} from "@mui/material";
import OrderItem from "./OrderItem";

const OrderCard = ({ order }) => {

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
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
