import { Box, Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";
import RatingItem from "../components/product/RatingItem";
import ToastNoti from "../components/toast-noti/ToastNoti";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ProductRatingPage = () => {
    const [reviews, setReviews] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [cookies] = useCookies([]);
    const [mockProducts, setMockProducts] = useState([]);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // New state for dialog

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const orderId = urlParams.get("orderId");

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/myOrder/${orderId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    const product = data.message.items;
                    setMockProducts(product);
                }
            });
    }, [orderId]);

    const handleSubmitReviews = () => {
        const submittedReviews = mockProducts.map((product) => ({
            productId: product.productId,
            star: reviews[product.productId]?.rating || 5,
            review: reviews[product.productId]?.content || "",
        }));

        console.log("Submitted Reviews:", submittedReviews);

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/${orderId}/rating`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${cookies.accessToken}`,
            },
            body: JSON.stringify({ ratings: submittedReviews }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    setShowToast(true);
                    setTimeout(() => {
                        setShowToast(false);
                        navigate("/orderManagement"); // Navigate after 3 seconds
                    }, 2000);
                }
            });
    };

    const handleOpenConfirmDialog = () => {
        setIsConfirmDialogOpen(true); // Open confirmation dialog
    };

    const handleCloseConfirmDialog = () => {
        setIsConfirmDialogOpen(false); // Close confirmation dialog without submitting
    };

    const handleConfirmSubmit = () => {
        setIsConfirmDialogOpen(false); // Close dialog and submit the reviews
        handleSubmitReviews();
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
                    <Grid item xs={12} key={product.productId}>
                        <RatingItem
                            product={product}
                            review={reviews[product.productId] || {}}
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
                    onClick={handleOpenConfirmDialog} // Open dialog on button click
                    sx={{ fontWeight: "bold", width: "10%" }}
                >
                    Submit
                </Button>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to submit your reviews?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

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
