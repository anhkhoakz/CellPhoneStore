
import React from "react";
import { Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Rating } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom to navigate

const ProductCard = ({ product }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    // Determine card size based on screen size
    const cardWidth = isSmallScreen ? 150 : isMediumScreen ? 180 : 220;
    const cardHeight = isSmallScreen ? 280 : isMediumScreen ? 320 : 350;

    const imageSize = cardWidth;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <Link
            to={`/product/${product.id}`} // Ensure you have a route for product details
            style={{ textDecoration: "none" }}
        >
            <Card sx={{ width: cardWidth, height: cardHeight, boxShadow: 3, margin: "auto" }}>
                <div
                    style={{
                        width: "100%",
                        height: "auto",
                        overflow: "hidden",
                    }}
                >
                    <CardMedia
                        component="img"
                        height={imageSize}
                        width={imageSize}
                        image={product.image}
                        alt={product.name}
                        sx={{
                            objectFit: "cover",
                            borderRadius: 1,
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                transform: "scale(1.2)", // Zoom effect on hover
                            },
                        }}
                    />
                </div>
                <CardContent>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            textAlign: "left",
                            fontSize: "1.25em",
                            "&:hover": { cursor: "pointer" },
                        }}
                        data-id={product.id}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "18px", textAlign: "left" }}
                    >
                        {formatPrice(product.price)} {/* Display price in VND */}
                    </Typography>

                    <Rating
                        name="product-rating"
                        value={product.rating}
                        precision={0.5}
                        readOnly
                        sx={{
                            marginTop: 1,
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    />
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductCard;
