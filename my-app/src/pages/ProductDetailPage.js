import React from "react";
import ProductNotFound from "../components/ProductNotFound";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { Box, Typography, Button, Grid, Divider, TextField, MenuItem } from "@mui/material";

const ProductDetailPage = () => {
    const product = {
        id: 1,
        name: "iPhone 13",
        price: 999,
        description:
            "The iPhone 13 is one of Apple's standout smartphones, launched in September 2021. With its sleek design, the iPhone 13 features an aluminum frame and a glass back, available in a variety of colors including Black, White, Product Red, Blue, Green, and Pink.",
        image: "https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-xanh-la-thumb-new-600x600.jpg",
    };

    const relaProducts = [
        { id: 1, name: "Product 1", price: 29.99, image: "/image/ip16.jpg" },
        { id: 2, name: "Product 2", price: 39.99, image: "/image/ip16.jpg" },
        { id: 3, name: "Product 3", price: 19.99, image: "/image/ip16.jpg" },
        { id: 4, name: "Product 4", price: 19.99, image: "/image/ip16.jpg" },
    ];

    const { id } = useParams();

    if (parseInt(id) !== product.id) {
        return <ProductNotFound />;
    }

    return (
        <Box sx={{ padding: "20px" }}>
            {/* Product Detail */}
            <Box sx={{ minHeight: "70vh", width: "80%", margin: "20px auto" }}>
                <Grid container spacing={4} alignItems="center">
                    {/* Hình ảnh bên trái */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                overflow: "hidden",
                                height: "400px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <img
                                style={{
                                    maxWidth: "90%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                    margin: "auto",
                                }}
                                src={product.image}
                                alt={product.name}
                            />
                        </Box>
                    </Grid>

                    {/* Nội dung bên phải */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ paddingLeft: 2 }}>
                            <Typography variant="h4" color="textPrimary" gutterBottom>
                                {product.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                                In stock
                            </Typography>
                            <Typography variant="h5" sx={{ color: "green", mb: 2 }}>
                                ${product.price}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>
                            <Box sx={{ my: 2 }}>
                                <Typography variant="body1" mb={1}>
                                    Color
                                </Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    fullWidth
                                    defaultValue="Black"
                                    sx={{ maxWidth: "150px", height: "35px", '& .MuiOutlinedInput-root': { height: "35px" } }}
                                >
                                    <MenuItem value="Black">Black</MenuItem>
                                    <MenuItem value="White">White</MenuItem>
                                    <MenuItem value="Blue">Blue</MenuItem>
                                </TextField>
                            </Box>
                            <Button variant="contained" color="success" sx={{ mr: 2 }}>
                                Buy now
                            </Button>
                            <Button variant="contained" color="primary">
                                Add to cart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Divider sx={{ maxWidth: "80%", margin: "20px auto" }} />
            <Box>
                <ProductList title="Similar items" products={relaProducts} />
            </Box>
        </Box>
    );
};

export default ProductDetailPage;
