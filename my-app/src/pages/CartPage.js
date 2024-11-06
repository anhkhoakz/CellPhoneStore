// CartPage.js
import React, { useState } from "react";
import { Box, Grid, Typography, Card, Divider, Button } from "@mui/material";
import CartItem from "../components/CartItem";
import CartEmpty from "../components/CartEmpty";
import Summary from "../components/Summary";
import { Link } from "react-router-dom";
import ExpressCheckout from "../components/ExpressCheckout";

const CartPage = () => {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "iPhone 13 Pro",
            category: "Smartphone",
            quantity: 1,
            price: 999,
            image: "https://techland.com.vn/wp-content/uploads/2021/09/iphone-13-pro-graphite-select.png",
        },
        {
            id: 2,
            name: "Samsung Galaxy S21",
            category: "Smartphone",
            quantity: 1,
            price: 799,
            image: "https://cdn.tgdd.vn/Products/Images/42/236128/samsung-galaxy-s21-plus-256gb-bac-600x600-600x600.jpg",
        },
        {
            id: 3,
            name: "Google Pixel 6",
            category: "Smartphone",
            quantity: 1,
            price: 699,
            image: "https://cdn.tgdd.vn/Products/Images/42/233009/google-pixel-6-600x600.jpg",
        },
    ]);

    const [shipping, setShipping] = useState(5);

    const handleQuantityChange = (id, value) => {
        const newItems = items.map((item) =>
            item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + value) }
                : item
        );
        setItems(newItems);
    };

    const handleRemoveItem = (id) => {
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
    };

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const total = subtotal + shipping;

    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid container spacing={4}>
                {/* Kiểm tra xem giỏ hàng có trống không */}
                {items.length === 0 ? (
                    <Grid item xs={12}>
                        <CartEmpty />
                    </Grid>
                ) : (
                    <>
                        {/* Cột bên trái - Giỏ hàng */}
                        <Grid item xs={12} md={8}>
                            <Card variant="outlined" sx={{ padding: 2 }}>
                                <Typography variant="h4" gutterBottom>
                                    Shopping Cart
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {items.length} items
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                {items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onQuantityChange={handleQuantityChange}
                                        onRemoveItem={handleRemoveItem}
                                    />
                                ))}
                                <Grid container justifyContent="space-between" sx={{ my: 2 }}>
                                    <Typography variant="h6">Price</Typography>
                                    <Typography variant="h6">${subtotal.toFixed(2)}</Typography>
                                </Grid>
                                <Divider sx={{ my: 2 }} />
                                <Button component={Link} to="/" variant="contained" color="primary">
                                    Go back to products
                                </Button>
                            </Card>
                        </Grid>

                        {/* Cột bên phải - Summary */}
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
                                <ExpressCheckout/>
                            </Card>
                            <Card variant="outlined" sx={{ padding: 2 }}>
                                <Summary
                                    subtotal={subtotal}
                                    total={total}
                                    shipping={shipping}
                                    setShipping={setShipping}
                                />
                            </Card>
                        </Grid>
                    </>
                )}
            </Grid>
        </Box>
    );
};

export default CartPage;
