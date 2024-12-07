import { ChevronLeft, ChevronRight } from "@mui/icons-material"; // Thay thế biểu tượng
import {
    Box,
    Divider,
    Grid,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ title, products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

    // Tính số lượng cột trên mỗi kích thước màn hình
    const getItemsPerRow = () => {
        if (isSmallScreen) {
            return 1; // Màn hình nhỏ: 1 cột
        } else if (isMediumScreen) {
            return 2; // Màn hình vừa: 2 cột
        } else if (isLargeScreen) {
            return 4; // Màn hình lớn: 4 cột
        } else {
            return 3; // Màn hình trung bình: 3 cột
        }
    };

    const itemsPerRow = getItemsPerRow();
    const visibleProducts = products.slice(
        currentIndex,
        currentIndex + itemsPerRow,
    ); // Hiển thị sản phẩm theo số lượng cột

    const handleNext = () => {
        setCurrentIndex((currentIndex + itemsPerRow) % products.length);
    };

    const handlePrevious = () => {
        setCurrentIndex(
            (currentIndex - itemsPerRow + products.length) % products.length,
        );
    };

    return (
        <Box
            className="product-list-container"
            sx={{ textAlign: "center", marginTop: 4 }}
        >
            <Typography
                variant="h4"
                component="h3"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                }}
            >
                {title}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                {/* Nút Previous */}
                <IconButton
                    onClick={handlePrevious}
                    sx={{
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        boxShadow: 3,
                        marginRight: 2,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.light,
                            color: "white",
                        },
                    }}
                >
                    <ChevronLeft sx={{ fontSize: 40 }} />
                </IconButton>

                {/* Danh sách sản phẩm */}
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ flex: "1 1 auto", maxWidth: "80%" }}
                >
                    {visibleProducts.map((product, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>

                {/* Nút Next */}
                <IconButton
                    onClick={handleNext}
                    sx={{
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        boxShadow: 3,
                        marginLeft: 2,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.light,
                            color: "white",
                        },
                    }}
                >
                    <ChevronRight sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>

            <Divider
                sx={{
                    marginTop: 4,
                    width: "80%",
                    margin: "40px auto",
                    backgroundColor: "blue",
                }}
            />
        </Box>
    );
};

export default ProductList;
