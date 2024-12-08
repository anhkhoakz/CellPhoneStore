import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Để lấy tham số danh mục từ URL
import ProductCard from "../components/product/ProductCard";
// Giả lập dữ liệu sản phẩm cho các danh mục


const CategoryPage = () => {
    const { category } = useParams(); // Lấy tham số danh mục từ URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Giả lập gọi API và lấy dữ liệu sản phẩm theo category
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/category/${category}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {

                if(data.success)
                {
                    console.log("Data:", data);

                    setProducts(data.message);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
    });

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
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                {category.toUpperCase()} PRODUCTS
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
                            <Grid item xs={12} sm={6} md={4} key={product.productId}>
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
