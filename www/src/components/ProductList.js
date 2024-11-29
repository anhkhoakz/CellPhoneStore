import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Grid, Typography, Box, useMediaQuery, useTheme, Divider, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material"; // Thay thế biểu tượng

const ProductList = ({ title, products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    
    useEffect(() => {
        if (isSmallScreen) {
            setItemsPerPage(1);
        } else if (isMediumScreen) {
            setItemsPerPage(2);
        } else {
            setItemsPerPage(4);
        }
    }, [isSmallScreen, isMediumScreen]);

    const visibleProducts = Array.from({ length: itemsPerPage }).map(
        (_, i) => products[(currentIndex + i) % products.length]
    );

    const handleNext = () => {
        setCurrentIndex((currentIndex + 1) % products.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((currentIndex - 1 + products.length) % products.length);
    };

    return (
        <Box className="product-list-container" sx={{ textAlign: 'center', marginTop: 4 }}>
            <Typography
                variant="h4"
                component="h3"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                }}
            >
                {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {/* Nút Previous ở bên trái với biểu tượng ChevronLeft */}
                <IconButton
                    onClick={handlePrevious}
                    sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        boxShadow: 3,
                        marginRight: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                            color: 'white',
                        },
                    }}
                >
                    <ChevronLeft sx={{ fontSize: 40 }} />
                </IconButton>

                {/* Danh sách sản phẩm */}
                <Grid container spacing={2} justifyContent="center" sx={{ flex: '1 1 auto', maxWidth: '80%' }}>
                    {visibleProducts.map((product, index) => (
                        <Grid item key={index}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>

                {/* Nút Next ở bên phải với biểu tượng ChevronRight */}
                <IconButton
                    onClick={handleNext}
                    sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        boxShadow: 3,
                        marginLeft: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                            color: 'white',
                        },
                    }}
                >
                    <ChevronRight sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>

            <Divider sx={{ marginTop: 4, width: "80%", margin: "40px auto", backgroundColor: "blue" }} />
        </Box>
    );
};

export default ProductList;
