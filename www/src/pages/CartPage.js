import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, Divider, Button } from "@mui/material";
import CartItem from "../components/cart/CartItem";
import CartEmpty from "../components/cart/CartEmpty";
import Summary from "../components/cart/Summary";
import { Link } from "react-router-dom";
import ExpressCheckout from "../components/cart/ExpressCheckout";
import ToastNoti from "../components/toast-noti/ToastNoti"; // Import ToastNoti

import { useCookies } from "react-cookie";

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [cookies] = useCookies(["accessToken"]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/cart`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.accessToken}`,
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.items || !Array.isArray(data.items)) {
                    console.error("Invalid data structure:", data);
                    return;
                }

                console.log(data);

                const transformedItems = data.items.map((item) => {
                    const variant =
                        item.variantId &&
                        item.productDetails.variants.find(
                            (v) => v._id === item.variantId
                        );

                    const id = variant ? variant._id : item.productDetails._id; // Variant ID or product ID
                    const productId = item.productDetails.productId;
                    const category = item.productDetails.category; // Category
                    const name = variant
                        ? `${item.productDetails.name} (${variant.name})`
                        : item.productDetails.name;
                    const quantity = item.quantity; // Quantity
                    const price = variant
                        ? variant.price
                        : item.productDetails.price; // Variant or product price
                    const image = variant
                        ? variant.image
                        : item.productDetails.image; // Variant or product image

                    return {
                        id,
                        productId,
                        name,
                        category,
                        quantity,
                        price,
                        image,
                    };
                });
                setItems(transformedItems);
            });
    }, []);

    const [shipping, setShipping] = useState(5);
    const [showToast, setShowToast] = useState(false); // State để lưu thông báo toast

    const handleQuantityChange = (id, value) => {

        // const quantity = items.find((item) => item.id === id).quantity;

        const item = items.find((item) => item.id === id);

        const { quantity, productId } = item;

        const newQuantity = quantity + value;



        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/cart`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.accessToken}`,
            },
            body: JSON.stringify({
                productId,
                variantId: id,
                quantity: newQuantity,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log("Quantity updated");
                    const newItems = items.map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(0, item.quantity + value) }
                            : item
                    );
                    setItems(newItems);
                }
            });

       
    };

    const handleRemoveItem = (id) => {
        const newItems = items.filter((item) => item.id !== id);

        const productId = items.find((item) => item.id === id).productId;

        // Xóa sản phẩm khỏi giỏ hàng
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/cart`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.accessToken}`,
            },
            body: JSON.stringify({
                productId,
                variantId: id,
            }),
        }).then((res) => {
            if (res.ok) {
                console.log("Item removed from cart");
            }
        });

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
        <Box sx={{ flexGrow: 1, padding: 4,  marginTop:"5em" }}>
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
                                <Typography variant="h4" gutterBottom sx={{fontWeight: "bold"}}>
                                    Shopping Cart
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                >
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
                                <Grid
                                    container
                                    justifyContent="space-between"
                                    sx={{ my: 2 }}
                                >
                                    <Typography variant="h6">Price</Typography>
                                    <Typography variant="h6">
                                        {subtotal.toFixed(2)} ₫
                                    </Typography>
                                </Grid>
                                <Divider sx={{ my: 2 }} />
                                <Button
                                    component={Link}
                                    to="/"
                                    variant="contained"
                                    color="primary"
                                >
                                    Go back to products
                                </Button>
                            </Card>
                        </Grid>

                        {/* Cột bên phải - Summary */}
                        <Grid item xs={12} md={4}>
                            <Card
                                variant="outlined"
                                sx={{ padding: 2, marginBottom: 2 }}
                            >
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
                    message="The product has been removed from your cart."
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Box>
    );
};

export default CartPage;
