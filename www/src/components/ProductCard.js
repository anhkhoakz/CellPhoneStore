import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom để điều hướng

const ProductCard = ({ product }) => {
	return (
		<Card sx={{ width: 200, height: 350, boxShadow: 3, margin: "auto" }}>
			<CardMedia component="img" height="250" image={product.image} alt={product.name} />
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
				<Typography variant="body2" color="text.secondary" sx={{ fontSize: "18px", textAlign: "left" }}>
					${product.price}
				</Typography>
			</CardContent>
		</Card>
	);
};

export default ProductCard;
