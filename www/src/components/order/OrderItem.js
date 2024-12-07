import React from "react";
import { Grid2 } from "@mui/material"; // Thay đổi import từ Grid sang Grid2
import { CardMedia, Typography } from "@mui/material";

const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

const OrderItem = ({ product }) => {
    return (
        <Grid2 container spacing={2}>
            <Grid2 xs={3} container justifyContent="center">
                <CardMedia
                    component="img"
                    src={`${process.env.REACT_APP_BACKEND_URL}/images/${product.image}`}
                    alt={product.name}
                    sx={{ borderRadius: 1, maxHeight: 150 }}
                />
            </Grid2>
            <Grid2 xs={9}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: {formatPrice(product.price)}</Typography>
                <Typography variant="body2">
                    Amount: {product.quantity}
                </Typography>
            </Grid2>
        </Grid2>
    );
};

export default OrderItem;
