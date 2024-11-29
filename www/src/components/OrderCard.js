import React from "react";
import { Card, CardContent, Button, Divider, Typography } from "@mui/material"; 
import OrderItem from "./OrderItem";

const OrderCard = ({ order }) => {
    return (
        <Card variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography color="textSecondary">Order Date: {order.date}</Typography>
                
                {order.products.map((product, index) => (
                    <React.Fragment key={index}>
                        <OrderItem product={product} />
                        {index < order.products.length - 1 && (
                            <Divider sx={{ marginY: 2 }} />
                        )}
                    </React.Fragment>
                ))}
                
                <Typography variant="h6">Total: ${order.total}</Typography>
                {order.status === "In Transit" ? (
                    <Button variant="contained" color="primary">
                        Track Order
                    </Button>
                ) : (
                    <Button variant="contained" color="success" disabled>
                        Delivered
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderCard;
