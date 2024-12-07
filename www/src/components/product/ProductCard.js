import {
    Card,
    CardContent,
    CardMedia,
    Rating,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React from "react";
<<<<<<< HEAD
import { Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Rating } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom to navigate
=======
import { Link } from "react-router-dom"; // Import Link từ react-router-dom để điều hướng
>>>>>>> c729abd4f258939c975f34cb37526992604a0fa8

const ProductCard = ({ product }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

<<<<<<< HEAD
    // Determine card size based on screen size
    const cardWidth = isSmallScreen ? 150 : isMediumScreen ? 180 : 220;
    const cardHeight = isSmallScreen ? 280 : isMediumScreen ? 320 : 350;
=======
    // Xác định kích thước thẻ theo kích thước màn hình
    const cardWidth = isSmallScreen ? 150 : isMediumScreen ? 180 : 220; // Điều chỉnh chiều rộng
    const cardHeight = isSmallScreen ? 280 : isMediumScreen ? 320 : 350; // Điều chỉnh chiều cao
>>>>>>> c729abd4f258939c975f34cb37526992604a0fa8

    const imageSize = cardWidth;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
<<<<<<< HEAD
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
=======
        <Card
            sx={{
                width: cardWidth,
                height: cardHeight,
                boxShadow: 3,
                margin: "auto",
            }}
        >
            <CardMedia
                component="img"
                height={imageSize} // Đảm bảo chiều cao hình ảnh bằng với chiều rộng
                width={imageSize} // Đảm bảo chiều rộng hình ảnh bằng với chiều rộng
                image={product.image}
                alt={product.name}
                sx={{
                    objectFit: "cover", // Đảm bảo hình ảnh không bị méo và sẽ được cắt bớt nếu cần
                    borderRadius: 1, // Thêm bo góc nếu muốn
                }}
            />
            <CardContent>
                <Link
                    to={`/product/${product.id}`} // Đảm bảo bạn có route cho chi tiết sản phẩm
                    style={{ textDecoration: "none" }}
>>>>>>> c729abd4f258939c975f34cb37526992604a0fa8
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
<<<<<<< HEAD
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
=======
                </Link>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "18px", textAlign: "left" }}
                >
                    {formatPrice(product.price)}{" "}
                    {/* Hiển thị giá dưới dạng VND */}
                </Typography>

                <Rating
                    name="product-rating"
                    value={product.rating}
                    precision={0.5}
                    readOnly
                    sx={{
                        marginTop: 1,
                        display: "flex", // Sử dụng flexbox
                        justifyContent: "flex-start", // Căn sang trái
                    }}
                />
            </CardContent>
        </Card>
>>>>>>> c729abd4f258939c975f34cb37526992604a0fa8
    );
};

export default ProductCard;
