import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const productDatabase = [
	{ productId: "PROD001", name: "Smartphone", originalPrice: 599, stockQuantity: 100 },
	{ productId: "PROD002", name: "Laptop", originalPrice: 1299, stockQuantity: 50 },
	{ productId: "PROD003", name: "Headphones", originalPrice: 199, stockQuantity: 200 },
	// Add more products as needed
];

const AddSaleProductDialog = ({ open, onClose, onAdd }) => {
	const [productData, setProductData] = useState({
		productId: "",
		newPrice: "",
		endTime: "",
	});
	const [productInfo, setProductInfo] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProductData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		if (name === "productId") {
			const foundProduct = productDatabase.find((product) => product.productId === value);
			setProductInfo(foundProduct || null);
		}
	};

	const handleAddProduct = () => {
		if (productInfo) {
			onAdd({
				productId: productData.productId,
				name: productInfo.name,
				originalPrice: productInfo.originalPrice,
				salePrice: parseFloat(productData.newPrice),
				endTime: productData.endTime,
				stockQuantity: productInfo.stockQuantity,
			});
		}
		setProductData({
			productId: "",
			newPrice: "",
			endTime: "",
		});
		setProductInfo(null);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Add Product</DialogTitle>
			<DialogContent>
				<Grid sx={{ mt: "5px" }} container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Product ID"
							name="productId"
							value={productData.productId}
							onChange={handleChange}
						/>
					</Grid>
					{productInfo && (
						<>
							<Grid item xs={12}>
								<Typography variant="body2">Name: {productInfo.name}</Typography>
								<Typography variant="body2">Original Price: ${productInfo.originalPrice}</Typography>
								<Typography variant="body2">Stock Quantity: {productInfo.stockQuantity}</Typography>
							</Grid>
						</>
					)}
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="New Sale Price"
							name="newPrice"
							type="number"
							value={productData.newPrice}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							label="End Time"
							name="endTime"
							type="date"
							value={productData.endTime}
							onChange={handleChange}
							InputLabelProps={{
								shrink: true,
							}}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleAddProduct} color="primary" disabled={!productInfo}>
					Add Product
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddSaleProductDialog;
