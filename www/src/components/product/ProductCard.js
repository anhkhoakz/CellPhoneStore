import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    useMediaQuery,
    useTheme,
    Rating,
    Box,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom to navigate

const ProductCard = ({ product, isHot, isNew }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    // Determine card size based on screen size
    const cardWidth = isSmallScreen ? 150 : isMediumScreen ? 220 : 220;
    const cardHeight = isSmallScreen ? 280 : isMediumScreen ? 350 : 350;

    const imageSize = cardWidth;

    // Format price to VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Calculate average rating
    const totalRatings = product.ratings?.length;
    const totalScore = product.ratings?.reduce(
        (acc, rating) => acc + rating.rating,
        0
    );
    const averageRating = totalRatings > 0 ? totalScore / totalRatings : 0;

    // Dynamic font sizes based on screen size
    const titleFontSize = isSmallScreen ? "1em" : isMediumScreen ? "1.2em" : "1.25em";
    const priceFontSize = isSmallScreen ? "16px" : isMediumScreen ? "18px" : "20px";

    // Hàm trả về nhãn (HOT hoặc NEW)
    const getLabel = () => {
        if (isHot) return "HOT";
        if (isNew) return "NEW";
        return null;
    };

    const label = getLabel(); // Lấy nhãn nếu có

    return (
        <Link
            to={`/product/${product.productId}`} // Ensure you have a route for product details
            style={{ textDecoration: "none" }}
        >
            <Card
                sx={{
                    width: cardWidth,
                    height: cardHeight,
                    boxShadow: 3,
                    margin: "auto",
                    position: "relative", // Positioning for the HOT or NEW label
                }}
            >
                {/* Nếu có nhãn thì hiển thị */}
                {label && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 5,
                            left: 5,
                            backgroundColor: label === "HOT" ? "red" : "green", // Đổi màu cho NEW
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            fontSize: "0.8em",
                            fontWeight: "bold",
                            zIndex: 10,
                        }}
                    >
                        {label}
                    </Box>
                )}

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
                        image={`${process.env.REACT_APP_BACKEND_URL}/images/${product.image}`}
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
                            fontSize: titleFontSize,
                            "&:hover": { cursor: "pointer" },
                        }}
                        data-id={product.productId}
                    >
                        {product.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: priceFontSize,
                            textAlign: "left",
                        }}
                    >
                        {formatPrice(product.price)}{" "}
                        {/* Display price in VND */}
                    </Typography>

                    <Rating
                        name="product-rating"
                        value={averageRating}
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
