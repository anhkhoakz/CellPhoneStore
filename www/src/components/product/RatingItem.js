import React from "react";
import { Box, Typography, TextField, Rating, CardMedia } from "@mui/material";

const RatingItem = ({ product, review, setReview }) => {
    const handleRatingChange = (event, newValue) => {
        setReview((prev) => ({
            ...prev,
            [product.id]: {
                ...prev[product.id],
                rating: newValue,
            },
        }));
    };

    const handleReviewChange = (event) => {
        setReview((prev) => ({
            ...prev,
            [product.id]: {
                ...prev[product.id],
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
                image={product.image}
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
                <Typography variant="body1" color="primary" sx={{ marginTop: 1 }}>
                    Price: ${product.price.toFixed(2)}
                </Typography>
            </Box>

            {/* Rating and Review */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="body1" mb={1}>
                    Rate this product:
                </Typography>
                <Rating
                    name={`rating-${product.id}`}
                    value={review?.rating || 5}
                    onChange={handleRatingChange}
                    precision={0.5}
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
