import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RatingItem from "../components/product/RatingItem";
import ToastNoti from "../components/toast-noti/ToastNoti";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

// Mock data


const ProductRatingPage = () => {
    const [reviews, setReviews] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [cookies] = useCookies([]);
    const [mockProducts, setMockProducts] = useState([]);

    // const mockProducts = [
    //     {
    //         id: 1,
    //         name: "Smartphone XYZ",
    //         price: 699.99,
    //         image: "https://placehold.co/500x500",
    //         description:
    //             "A high-end smartphone with excellent features. Camera: 64MP, Battery: 4000mAh, Display: 6.5 inches.",
    //     }
    // ];

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
            body: JSON.stringify({ratings: submittedReviews}),
        }).then((res) =>res.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                // showToastMessage("Your reviews have been submitted!");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);

                // Redirect to Order Management Page
                navigate("/orderManagement");
            }
        });

        
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
