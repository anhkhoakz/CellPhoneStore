import React, { useState } from "react";
import ProductNotFound from "../components/ProductNotFound";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { Box, Typography, Button, Grid, Divider, TextField, MenuItem } from "@mui/material";
import Comment from "../components/Comment";
import ShowComment from "../components/ShowComment";

const ProductDetailPage = () => {
  const product = {
    id: 1,
    name: "iPhone 13",
    price: 999,
    description:
      "The iPhone 13 is one of Apple's standout smartphones, launched in September 2021. With its sleek design, the iPhone 13 features an aluminum frame and a glass back, available in a variety of colors including Black, White, Blue, and Green.",
    colors: [
      { name: "Black", image: "https://phongapple.vn/wp-content/uploads/2021/10/13bl.png" },
      { name: "White", image: "https://mega.com.vn/media/product/20113_iphone_13_256gb_white.jpg" },
      { name: "Blue", image: "https://product.hstatic.net/200000456405/product/1_3d5d4ed67e884776aa5a003142b23346.jpg" },
      { name: "Green", image: "https://clickbuy.com.vn/uploads/images/2022/03/avt-iphone-13-green.png" },
    ],
  };

  const relaProducts = [
    { id: 1, name: "Product 1", price: 29.99, image: "/image/ip16.jpg" },
    { id: 2, name: "Product 2", price: 39.99, image: "/image/ip16.jpg" },
    { id: 3, name: "Product 3", price: 19.99, image: "/image/ip16.jpg" },
    { id: 4, name: "Product 4", price: 19.99, image: "/image/ip16.jpg" },
  ];

  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]); // Màu mặc định
  const [comments, setComments] = useState([
    {
      username: "John Doe",
      content: "Great product! I love it!",
      date: "2024-11-05T12:00:00Z",
    },
    {
      username: "Jane Smith",
      content: "Good value for money, but could be better in some aspects.",
      date: "2024-11-04T08:30:00Z",
    },
  ]);

  if (parseInt(id) !== product.id) {
    return <ProductNotFound />;
  }

  const handleColorChange = (event) => {
    const color = product.colors.find(c => c.name === event.target.value);
    setSelectedColor(color);
  };

  const handleSubmitComment = (newCommentContent) => {
    const newComment = {
      username: "Current User", 
      content: newCommentContent,
      date: new Date().toISOString(),
    };
    setComments([newComment, ...comments]); 
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Product Detail */}
      <Box sx={{ minHeight: "70vh", width: "80%", margin: "20px auto" }}>
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
                src={selectedColor.image}
                alt={`${product.name} - ${selectedColor.name}`}
              />
            </Box>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ paddingLeft: 2 }}>
              <Typography variant="h4" color="textPrimary" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                In stock
              </Typography>
              <Typography variant="h5" sx={{ color: "green", mb: 2 }}>
                ${product.price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="body1" mb={1}>
                  Color
                </Typography>
                <TextField
                  select
                  variant="outlined"
                  fullWidth
                  value={selectedColor.name}
                  onChange={handleColorChange}
                  sx={{ maxWidth: "150px", height: "35px", '& .MuiOutlinedInput-root': { height: "35px" } }}
                >
                  {product.colors.map((color) => (
                    <MenuItem key={color.name} value={color.name}>
                      {color.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Button variant="contained" color="success" sx={{ mr: 2 }}>
                Buy now
              </Button>
              <Button variant="contained" color="primary">
                Add to cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ maxWidth: "80%", margin: "20px auto" }} />
      <Box>
        <ProductList title="Similar items" products={relaProducts} />
      </Box>

      {/* Comments Section */}
      <Box sx={{ marginTop: 5, maxWidth: "70%", margin: "20px auto" }}>
        <Comment onSubmitComment={handleSubmitComment} />
        {comments.map((comment, index) => (
          <ShowComment key={index} comment={comment} />
        ))}
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
