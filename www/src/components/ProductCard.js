import React from "react";
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductCard = ({ product }) => {
    return (
        <Card sx={{ maxWidth: 345, boxShadow: 3, margin: 'auto' }}>
            <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ${product.price}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                >
                    Add to cart
                </Button>
                <Button
                    variant="contained"
                    color="success"
                >
                    Buy Now
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
