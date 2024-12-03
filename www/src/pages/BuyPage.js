import React, { useState } from "react";
import { Box, Grid, Typography, Card, Divider, Button } from "@mui/material";
import CartItem from "../components/cart/CartItem";
import CartEmpty from "../components/cart/CartEmpty";
import Summary from "../components/cart/Summary";
import { Link } from "react-router-dom";
import ExpressCheckout from "../components/cart/ExpressCheckout";
import ToastNoti from "../components/toast-noti/ToastNoti"; // Import ToastNoti

const BuyPage = () => {
    // Dữ liệu tĩnh cho giỏ hàng
    const [items, setItems] = useState([
        {
            id: "1",
            productId: "p1",
            name: "Product 1",
            category: "Category 1",
            quantity: 2,
            price: 10.0,
            image: "product1.jpg"
        },
        {
            id: "2",
            productId: "p2",
            name: "Product 2",
            category: "Category 2",
            quantity: 1,
            price: 15.0,
            image: "product2.jpg"
        }
    ]);

    const [shipping, setShipping] = useState(5);
    const [showToast, setShowToast] = useState(false); // State để lưu thông báo toast

    const handleQuantityChange = (id, value) => {
        const item = items.find((item) => item.id === id);
        const { quantity } = item;
        const newQuantity = quantity + value;

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
        setShowToast(true); // Hiển thị thông báo khi xóa sản phẩm
        setTimeout(() => setShowToast(false), 3000); // Ẩn thông báo sau 3 giây
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
                                    Buy Now
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
                                <ExpressCheckout />
                            </Card>
                            <Card variant="outlined" sx={{ padding: 2 }}>
                                <Summary
                                    subtotal={subtotal}
                                    total={total}
                                    shipping={shipping}
                                    setShipping={setShipping}
                                    items={items}
                                />
                            </Card>
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Toast Notification */}
            {showToast && (
                <ToastNoti
                    message="The product has been removed"
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Box>
    );
};

export default BuyPage;
