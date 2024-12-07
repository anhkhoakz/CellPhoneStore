import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ProductNotFound from "../components/product/ProductNotFound";
import { useParams } from "react-router-dom";
import ProductList from "../components/product/ProductList";
import {
    Box,
    Typography,
    Button,
    Grid,
    Divider,
    TextField,
    MenuItem,
    Rating,
} from "@mui/material";
import ToastNoti from "../components/toast-noti/ToastNoti";
import CommentsSection from "../components/product/CommentSection";

const ProductDetailPage = () => {
    const [product, setProduct] = useState(null);

    const [selectedColor, setSelectedColor] = useState(null); // Default color

    const [loading, setLoading] = useState(true);
    // This should be at the top, outside of any conditional or function
    const [showToast, setShowToast] = useState(false);

    const [error, setError] = useState(false);

    const { id } = useParams();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const [cookies] = useCookies(["accessToken"]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${id}`
                );

                if (res.status !== 200) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                const data = await res.json();

                setProduct(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Mock data for related products

    const relaProducts = [
        { id: 1, name: "Product 1", price: 29.99, image: "/image/ip16.jpg" },
        { id: 2, name: "Product 2", price: 39.99, image: "/image/ip16.jpg" },
        { id: 3, name: "Product 3", price: 19.99, image: "/image/ip16.jpg" },
        { id: 4, name: "Product 4", price: 19.99, image: "/image/ip16.jpg" },
    ];

    // Mock data for product images

    const tempImages = [
        "https://placehold.co/100x100",
        "https://placehold.co/100x100",
        "https://placehold.co/100x100",
        "https://placehold.co/100x100"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const handleColorChange = (event) => {
        const color = product.variants.find(
            (c) => c.name === event.target.value
        );
        setSelectedColor(color);
    };

    const handleAddToCart = () => {

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/cart`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.accessToken}`,
            },
            body: JSON.stringify({
                productId: product.productId,
                quantity: 1,
                variantId: selectedColor?._id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }
                else
                    alert(JSON.stringify(data));
                // alert("Vui long chon mau san pham");
            });

        // Hide toast after 3 seconds
    };

    const handleSubmitComment = (newComment) => {
        // You can handle this to notify parent or log, or any other purpose

    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error || !product) {
        return <ProductNotFound />;
    }

    return (
        <Box sx={{ padding: "1.25em", marginTop: "4em" }}>
            {/* Product Detail */}
            <Box
                sx={{ minHeight: "70vh", width: "80%", margin: "1.25em auto" }}
            >
                <Grid container spacing={4} alignItems="center">
                    {/* Image Section */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "center",
                                overflow: "hidden",
                                height: "400px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <img
                                style={{
                                    maxWidth: "90%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                    margin: "auto",
                                }}
                                src={`${process.env.REACT_APP_BACKEND_URL}/images/${selectedColor?.image || product.image}`}
                                alt={`${product?.name} - ${selectedColor?.name || ''}`}
                            />
                        </Box>
                        <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
                            {tempImages.map((image, index) => (
                                <Button key={index} onClick={() => handleImageChange(index)}>
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            border: currentImageIndex === index ? "2px solid #00796b" : "none",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Button>
                            ))}
                        </Box>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ paddingLeft: 2 }}>
                            <Typography
                                variant="h4"
                                color="textPrimary"
                                gutterBottom
                            >
                                {product.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                sx={{ mb: 1 }}
                            >
                                In stock
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ color: "green", mb: 2 }}
                            >
                                {formatPrice(product.price)}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                
                                <Rating
                                    name="product-rating"
                                    value={product.averageRating || 0} 
                                    precision={0.5}
                                    readOnly
                                />
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    ({product.ratingCount || 0} reviews)
                                </Typography>
                            </Box>

                            <Box sx={{ my: 2 }}>
                                <Typography variant="body1" mb={1}>
                                    Color
                                </Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    fullWidth
                                    value={selectedColor?.name}
                                    onChange={handleColorChange}
                                    sx={{
                                        maxWidth: "150px",
                                        height: "35px",
                                        "& .MuiOutlinedInput-root": {
                                            height: "35px",
                                        },
                                    }}
                                >
                                    {product.variants.map((color) => (
                                        <MenuItem
                                            key={color.name}
                                            value={color.name}
                                        >
                                            {color.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mr: 2 }}
                            >
                                Buy now
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddToCart}
                            >
                                Add to cart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Divider sx={{ maxWidth: "80%", margin: "1.25em auto" }} />
            <Box>
                <ProductList title="Similar items" products={relaProducts} />
            </Box>

            {/* Comments Section */}
            <Box sx={{ marginTop: 5, maxWidth: "70%", margin: "1.25em auto" }}>
                <CommentsSection
                    initialComments={product.comments}
                    id={id}
                    onSubmitComment={handleSubmitComment}
                />
            </Box>

            {/* Toast Notification */}
            {showToast && (
                <ToastNoti
                    message="The product has been added to the cart!"
                    type="success"
                    position="top-right"
                    autoClose={3000}
                />
            )}
        </Box>
    );
};

export default ProductDetailPage;
