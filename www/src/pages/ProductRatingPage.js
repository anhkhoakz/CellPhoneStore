import React, { useState } from "react";
import { Box, Typography, Button, TextField, Rating, CardMedia, Grid } from "@mui/material";
import ToastNoti from "../components/toast-noti/ToastNoti";

const ProductRatingPage = () => {
    // Mock product data
    const mockProduct = {
        name: "Smartphone XYZ",
        description: "A high-end smartphone with excellent features. Camera: 64MP, Battery: 4000mAh, Display: 6.5 inches.",
        price: 699.99,
        image: "https://placehold.co/500x500",
        id: 1
    };

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5); // Default rating is 5
    const [showToast, setShowToast] = useState(false);

    const handleSubmitReview = () => {
        const newReviewData = {
            username: "Current User", 
            content: newReview,
            rating: newRating, 
            date: new Date().toISOString(),
        };

        setNewRating(5); // Reset the rating after submission
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <Box sx={{ padding: "1.25em", width: "80%", margin: "5em auto", minHeight: "75vh" }}>
            {/* Title Section */}
            <Typography
                sx={{ marginBottom: "1em", fontWeight: "bold" }}
                variant="h4"
                align="center"
                gutterBottom
            >
                Product Rating & Review
            </Typography>

            <Grid container spacing={4}>
                {/* Left: Product Image and Details */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <CardMedia
                            component="img"
                            alt={mockProduct.name}
                            height="300"
                            image={mockProduct.image}
                            sx={{ borderRadius: "8px", objectFit: "contain" }}
                        />
                        <Typography variant="h5" color="primary" sx={{ marginTop: "1em" }}>
                            {mockProduct.name}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ marginBottom: "1em" }}>
                            Price: ${mockProduct.price}
                        </Typography>
                    </Box>
                </Grid>

                {/* Right: Review Form */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ paddingLeft: { md: 2 } }}>
                        <Typography variant="body1" mb={1}>
                            Rate the product:
                        </Typography>
                        <Rating
                            name="product-rating"
                            value={newRating}
                            onChange={(_, newValue) => setNewRating(newValue)}
                            precision={0.5}
                            sx={{ mb: 2, fontSize: "2.5rem" }}
                        />
                        <Typography variant="body1" mb={1}>
                            Your review:
                        </Typography>
                        <TextField
                            label="Write a review"
                            multiline
                            rows={4}
                            fullWidth
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            variant="outlined"
                            sx={{ marginBottom: "1em" }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitReview}
                            disabled={!newReview.trim()}
                        >
                            Submit Review
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Toast Notification */}
            {showToast && (
                <ToastNoti
                    message="Your review has been submitted!"
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Box>
    );
};

export default ProductRatingPage;
