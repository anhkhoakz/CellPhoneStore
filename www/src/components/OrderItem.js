import React from "react";
import { Grid2 } from "@mui/material"; // Thay đổi import từ Grid sang Grid2
import { CardMedia, Typography } from "@mui/material";

const OrderItem = ({ product }) => {
    return (
        <Grid2 container spacing={2}>
            <Grid2 xs={3} container justifyContent="center">
                <CardMedia
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{ borderRadius: 1, maxHeight: 150 }}
                />
            </Grid2>
            <Grid2 xs={9}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">
                    Amount: {product.amount}
                </Typography>
            </Grid2>
        </Grid2>
    );
};

export default OrderItem;
