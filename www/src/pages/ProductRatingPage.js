import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import RatingItem from "../components/product/RatingItem";
import ToastNoti from "../components/toast-noti/ToastNoti";

// Mock data
const mockProducts = [
    {
        id: 1,
        name: "Smartphone XYZ",
        price: 699.99,
        image: "https://placehold.co/500x500",
        description:
            "A high-end smartphone with excellent features. Camera: 64MP, Battery: 4000mAh, Display: 6.5 inches.",
    },
    {
        id: 2,
        name: "Laptop ABC",
        price: 1299.99,
        image: "https://placehold.co/500x500",
        description:
            "A powerful laptop for all your professional needs. Processor: Intel i7, RAM: 16GB, Storage: 1TB SSD.",
    },
    {
        id: 3,
        name: "Wireless Earbuds DEF",
        price: 199.99,
        image: "https://placehold.co/500x500",
        description:
            "Noise-cancelling wireless earbuds with premium sound quality. Battery life: 20 hours.",
    },
];

const ProductRatingPage = () => {
    const [reviews, setReviews] = useState({});
    const [showToast, setShowToast] = useState(false);

    const handleSubmitReviews = () => {
        const submittedReviews = mockProducts.map((product) => ({
            productId: product.id,
            rating: reviews[product.id]?.rating || 5,
            content: reviews[product.id]?.content || "",
        }));

        console.log("Submitted Reviews:", submittedReviews);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <Box
            sx={{
                padding: "1.25em",
                width: "80%",
                margin: "5em auto 1em auto",
                minHeight: "75vh",
            }}
        >
            <Typography
                sx={{ marginBottom: "1em", fontWeight: "bold" }}
                variant="h4"
                align="center"
                gutterBottom
            >
                Rate Your Purchased Products
            </Typography>

            <Grid container spacing={4}>
                {mockProducts.map((product) => (
                    <Grid item xs={12} key={product.id}>
                        <RatingItem
                            product={product}
                            review={reviews[product.id]}
                            setReview={setReviews}
                        />
                    </Grid>
                ))}
            </Grid>

            <Box
                sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmitReviews}
                    sx={{ fontWeight: "bold", width: "10%" }}
                >
                    Submit
                </Button>
            </Box>

            {/* Toast Notification */}
            {showToast && (
                <ToastNoti
                    message="Your reviews have been submitted!"
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Box>
    );
};

export default ProductRatingPage;
