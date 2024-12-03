import React from "react";
import { Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Rating } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom để điều hướng

const ProductCard = ({ product }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    // Xác định kích thước thẻ theo kích thước màn hình
    const cardWidth = isSmallScreen ? 150 : isMediumScreen ? 180 : 220;  // Điều chỉnh chiều rộng
    const cardHeight = isSmallScreen ? 280 : isMediumScreen ? 320 : 350;  // Điều chỉnh chiều cao

    // Sử dụng chiều cao và chiều rộng bằng nhau cho hình ảnh, đảm bảo hình vuông
    const imageSize = cardWidth; // Chiều rộng và chiều cao của hình ảnh đều bằng chiều rộng của card

    return (
        <Card sx={{ width: cardWidth, height: cardHeight, boxShadow: 3, margin: "auto" }}>
            <CardMedia
                component="img"
                height={imageSize}  // Đảm bảo chiều cao hình ảnh bằng với chiều rộng
                width={imageSize}   // Đảm bảo chiều rộng hình ảnh bằng với chiều rộng
                image={product.image}
                alt={product.name}
                sx={{
                    objectFit: "cover",  // Đảm bảo hình ảnh không bị méo và sẽ được cắt bớt nếu cần
                    borderRadius: 1, // Thêm bo góc nếu muốn
                }}
            />
            <CardContent>
                <Link
                    to={`/product/${product.id}`} // Đảm bảo bạn có route cho chi tiết sản phẩm
                    style={{ textDecoration: "none" }}
                >
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
                </Link>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "18px", textAlign: "left" }}
                >
                    ${product.price}
                </Typography>

                <Rating
                    name="product-rating"
                    value={product.rating}
                    precision={0.5}
                    readOnly
                    sx={{
                        marginTop: 1,
                        display: "flex",  // Sử dụng flexbox
                        justifyContent: "flex-start",  // Căn sang trái
                    }}
                />

            </CardContent>
        </Card>
    );
};

export default ProductCard;
