import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Để lấy tham số danh mục từ URL
import ProductCard from "../components/product/ProductCard";
// Giả lập dữ liệu sản phẩm cho các danh mục
const productsData = {
    laptop: [
        {
            id: 1,
            name: "Laptop 1",
            price: 999.99,
            image: "laptop1.jpg",
            category: "Laptop",
            rating: 4.5,
        },
        {
            id: 2,
            name: "Laptop 2",
            price: 1299.99,
            image: "laptop2.jpg",
            category: "Laptop",
            rating: 4.2,
        },
    ],
    electronics: [
        {
            id: 3,
            name: "Smartphone 1",
            price: 599.99,
            image: "smartphone1.jpg",
            category: "Electronics",
            rating: 4.7,
        },
        {
            id: 4,
            name: "Smartwatch 1",
            price: 199.99,
            image: "smartwatch1.jpg",
            category: "Electronics",
            rating: 4.0,
        },
    ],
    fashion: [
        {
            id: 5,
            name: "T-shirt 1",
            price: 19.99,
            image: "tshirt1.jpg",
            category: "Fashion",
            rating: 4.3,
        },
        {
            id: 6,
            name: "Jeans 1",
            price: 49.99,
            image: "jeans1.jpg",
            category: "Fashion",
            rating: 4.6,
        },
    ],
};

const CategoryPage = () => {
    const { category } = useParams(); // Lấy tham số danh mục từ URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Giả lập gọi API và lấy dữ liệu sản phẩm theo category
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (productsData[category]) {
                setProducts(productsData[category]);
            } else {
                setProducts([]); // Nếu không có danh mục, trả về mảng trống
            }
            setLoading(false);
        }, 1000); // Giả lập thời gian tải dữ liệu
    }, [category]);

    return (
        <Box
            sx={{
                maxWidth: "1200px",
                margin: "5em auto auto auto",
                padding: 2,
                minHeight: "80vh",
            }}
        >
            <Typography variant="h4" gutterBottom>
                {category.charAt(0).toUpperCase() + category.slice(1)} Products
            </Typography>
            <Box sx={{ paddingTop: 2 }}>
                {loading ? (
                    <CircularProgress />
                ) : products.length === 0 ? (
                    <Typography variant="h6">
                        No products found in this category
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default CategoryPage;
