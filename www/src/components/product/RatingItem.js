import { Box, CardMedia, Rating, TextField, Typography } from "@mui/material";
import React from "react";

const RatingItem = ({ product, review, setReview }) => {
    const handleRatingChange = (_event, newValue) => {
        setReview((prev) => ({
            ...prev,
            [product.productId]: {
                ...prev[product.productId],
                rating: newValue,
            },
        }));
    };

    const handleReviewChange = (event) => {
        setReview((prev) => ({
            ...prev,
            [product.productId]: {
                ...prev[product.productId],
                content: event.target.value,
            },
        }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: "center",
                marginBottom: 3,
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: "8px",
            }}
        >
            {/* Product Image */}
            <CardMedia
                component="img"
                alt={product.name}
                height="100"
                image={`${process.env.REACT_APP_BACKEND_URL}/images/${product.image}`}
                sx={{
                    objectFit: "contain",
                    width: "100px",
                    borderRadius: "8px",
                }}
            />
            {/* Product Details */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography
                    variant="body1"
                    color="primary"
                    sx={{ marginTop: 1 }}
                >
                    Price: ${product.price.toFixed(2)}
                </Typography>
            </Box>

            {/* Rating and Review */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="body1" mb={1}>
                    Rate this product:
                </Typography>
                <Rating
                    name={`rating-${product.productId}`}
                    value={review?.rating || 5}
                    onChange={handleRatingChange}
                    precision={1}
                />
                <Typography variant="body1" mt={2}>
                    Your review:
                </Typography>
                <TextField
                    label="Write your review"
                    multiline
                    rows={2}
                    fullWidth
                    value={review?.content || ""}
                    onChange={handleReviewChange}
                    variant="outlined"
                    sx={{ marginTop: 1 }}
                />
            </Box>
        </Box>
    );
};

export default RatingItem;
