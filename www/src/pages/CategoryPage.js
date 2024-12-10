import {
    Box,
    CircularProgress,
    Grid,
    Pagination,
    Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Để lấy tham số danh mục từ URL
import ProductCard from "../components/product/ProductCard";

const CategoryPage = () => {
    const { category } = useParams(); // Lấy tham số danh mục từ URL
    const [products, setProducts] = useState([]); // Danh sách sản phẩm
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [page, setPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang

    // Giả lập gọi API và lấy dữ liệu sản phẩm theo category
    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/category/${category}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProducts(data.message); // Lấy sản phẩm từ API
                    setTotalPages(Math.ceil(data.message.length / 12)); // Tính tổng số trang
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [category]);

    // Xử lý thay đổi trang
    const handleChangePage = (event, value) => {
        setPage(value); // Cập nhật trang hiện tại
    };

    // Lấy sản phẩm của trang hiện tại
    const getPaginatedProducts = () => {
        const startIndex = (page - 1) * 12; // Tính chỉ số bắt đầu
        const endIndex = startIndex + 12; // Tính chỉ số kết thúc
        return products.slice(startIndex, endIndex); // Cắt mảng sản phẩm
    };

    return (
        <Box
            sx={{
                maxWidth: "1200px",
                margin: "5em auto auto auto",
                padding: 2,
                minHeight: "80vh",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold" }}
            >
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
                    <>
                        {/* Hiển thị các sản phẩm của trang hiện tại */}
                        <Grid container spacing={4}>
                            {getPaginatedProducts().map((product) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={3}
                                    key={product.productId}
                                >
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Phân trang */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 3,
                            }}
                        >
                            <Pagination
                                count={totalPages} // Tổng số trang
                                page={page} // Trang hiện tại
                                onChange={handleChangePage} // Hàm xử lý khi thay đổi trang
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default CategoryPage;
