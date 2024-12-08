// components/category/Category.js
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Category = ({ categories }) => {
    return (
        <Box sx={{ margin: "2em auto", padding: "1em", backgroundColor: "#f9f9f9", maxWidth: "70%", }} >
            <Typography variant="h4" sx={{ marginBottom: "0.5em", fontWeight: "bold", color: "#1977d3", textAlign: "center" }}>
                SHOP BY CATEGORY
            </Typography>
            <Box sx={{
                display: "flex",
                gap: "1em",
                flexWrap: "wrap",
                justifyContent: "center", // Căn giữa các phần tử theo chiều ngang
                margin: "0 auto", // Đảm bảo hộp cha được căn giữa trên toàn trang
                maxWidth: "80%", // Giới hạn chiều rộng của hộp cha (tuỳ chỉnh)
            }}>
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        to={`/catagory/${category.name.toLowerCase()}`} // Điều hướng đến trang danh mục theo tên
                        style={{ textDecoration: "none" }}
                    >
                        <Button
                            variant="outlined"
                            sx={{ padding: "1em", width: "150px" }}
                        >
                            {category.name}
                        </Button>
                    </Link>
                ))}
            </Box>

        </Box>
    );
};

export default Category;
