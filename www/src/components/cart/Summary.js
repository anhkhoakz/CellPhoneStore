import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import CustomerInfo from "./CustomerInfo"; // Import CustomerInfo
import LoggedCustomerInfo from "./LoggedCustomerInfo";

import ToastNoti from "../toast-noti/ToastNoti";

const Summary = ({ total, items }) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success");

	const [savedAddresses, setSavedAddresses] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

	const [shippingCost, setShippingCost] = useState(0);
	const [shippingType, setShippingType] = useState("standard");
	const [discountCode, setDiscountCode] = useState("");

	const [availableCoupons, setAvailableCoupons] = useState([""]);

	const [shippingMethod, setShippingMethod] = useState([""]);

	const [loyaltyPoints, setLoyaltyPoints] = useState(); // Example points
	const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

	const [cookies] = useCookies([]);
	const navigate = useNavigate();

	const categories = items.map((item) => item.category);

	useEffect(() => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${cookies.userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies.accessToken}`,
				},
				credentials: "include",
			},
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);

				if (data.success) {
					// Set user data
					const defaultAddressDetails = data.message.addresses
						.filter((address) => address.isDefault) // Filter addresses with isDefault = true
						.map((address) => address);

					setName(defaultAddressDetails[0].receiver || data.message.username);
					setPhone(defaultAddressDetails[0].phone || data.message.phone);
					setEmail(data.message.email);
					setSavedAddresses(
						data.message.addresses.map((address) => address.detail),
					);

					setSelectedAddress(defaultAddressDetails[0].detail);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, [cookies.accessToken]);

	useEffect(() => {
		if (!selectedAddress) return; // Early return if no address is selected

		const addressParts = selectedAddress.split(",");

		const city = addressParts[addressParts.length - 1]
			.replace(/( Province| City| Town)$/i, "")
			.trim();
		const district = addressParts[addressParts.length - 2]
			.replace(/( District| City| Town)$/i, "")
			.trim();

		fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/cart/shipping-fee`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				shippingAddress: {
					city: city,
					district: district,
				},
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setShippingMethod(data.shippingFee);
				} else {
					console.error("Shipping fee fetch failed:", data.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, [selectedAddress]); // Only runs when selectedAddress changes

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/loyalty`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.accessToken}`,
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);

				if (data.success) {
					// Set loyalty points

					console.log(data.message);
					setLoyaltyPoints(data.message.pointsEarned);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, [cookies.accessToken]);

	useEffect(() => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}/api/v1/coupons/getCouponsByCondition`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies.accessToken}`,
				},
				credentials: "include",

				body: JSON.stringify({
					condition: {
						minOrderValue: total,
						applicableCategories: categories,
					},
				}),
			},
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data || "No data received");
				console.log(categories);

				if (data.success) {
					setAvailableCoupons(data.data);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}, [cookies.accessToken]);

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};

	const calculateTotal = () => {
		const discountPoint = useLoyaltyPoints ? loyaltyPoints : 0;

		const discount = availableCoupons.find(
			(coupon) => coupon.code === discountCode,
		);

		const discountType = discount ? discount.type : "";

		const discountValue = discount ? discount.discount : 0;

		if (discountType === "percentage") {
			return Math.max(
				total + shippingCost - (total * discountValue) / 100 - discountPoint,
				0,
			);
		}

		if (discountType === "fixed") {
			return Math.max(total + shippingCost - discountValue - discountPoint, 0);
		}

		return Math.max(total + shippingCost - discountPoint, 0);
	};

	const handleLoyaltySwitch = (event) => {
		setUseLoyaltyPoints(event.target.checked);
	};

	const handleCouponSelect = (e) => {
		setDiscountCode(e.target.value);
	};

	const handleSubmit = () => {
		console.log("Customer Information:", { name, phone, selectedAddress });
		console.log("Shipping:", shippingCost);
		console.log("Discount Code:", discountCode);
		console.log("Total Price:", total);
		console.log("Items:", items);

		if (useLoyaltyPoints) {
			console.log("Loyalty Points used:", loyaltyPoints);
		}

		fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/checkout`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.accessToken}`,
			},
			body: JSON.stringify({
				couponCode: discountCode,
				shippingAddress: {
					city: "City",
					district: "District",
					village: "Village",
					detail: selectedAddress,
					phone,
					name,
				},
				items: items,
				email: email,
				shippingOption: shippingType,
				total,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setToastType("success");
					setToastMessage("Order placed successfully!");
					navigate("/success");
				} else {
					setToastType("error");
					setToastMessage(data.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const handleToastReset = () => {
		setTimeout(() => setToastMessage(""), 3000);
	};

	// Check if the user is logged in
	const isLoggedIn = Boolean(cookies.userId);

	return (
		<Box className="p-5">
			{/* Show LoggedCustomerInfo if logged in, else show CustomerInfo */}
			{isLoggedIn ? (
				<LoggedCustomerInfo
					name={name}
					phone={phone}
					setPhone={setPhone}
					email={email}
					setEmail={setEmail}
					savedAddresses={savedAddresses}
					selectedAddress={selectedAddress}
					setSelectedAddress={setSelectedAddress}
				/>
			) : (
				<CustomerInfo
					setEmail={setEmail}
					setName={setName}
					setPhone={setPhone}
					setAddress={setSelectedAddress}
				/>
			)}

			<hr className="my-4" />

			{/* Summary Section */}
			<Typography variant="h5" component="h3" gutterBottom>
				Summary
			</Typography>

			<Typography variant="h6" gutterBottom>
				Shipping
			</Typography>

			{!savedAddresses.isEmpty && (
				<FormControl fullWidth margin="normal">
					<InputLabel id="delivery-method-label">Delivery Method</InputLabel>
					<Select
						labelId="delivery-method-label"
						value={shippingCost || 0}
						onChange={(e) => {
							const value = Number(e.target.value);
							setShippingCost(value);

							// Determine shipping type based on selected value
							if (value === shippingMethod.standard) {
								setShippingType("standard");
							} else if (value === shippingMethod.express) {
								setShippingType("express");
							}
						}}
						label="Delivery Method"
					>
						<MenuItem value={shippingMethod.standard}>
							Standard Delivery -{" "}
							{shippingMethod.standard?.toLocaleString() || "0"} ₫
						</MenuItem>
						<MenuItem value={shippingMethod.express}>
							Express Delivery -{" "}
							{shippingMethod.express?.toLocaleString() || "0"} ₫
						</MenuItem>
					</Select>
				</FormControl>
			)}

			{/* Discount Code Section */}

			{isLoggedIn && (
				<>
					<Typography variant="h6" gutterBottom>
						Discount Code
					</Typography>
					<FormControl fullWidth margin="normal">
						<InputLabel>Select Coupon</InputLabel>
						<Select
							value={discountCode}
							onChange={handleCouponSelect}
							label="Select Coupon"
						>
							<MenuItem value="">None</MenuItem>
							{availableCoupons.map((coupon) => (
								<MenuItem key={coupon.code} value={coupon.code}>
									{coupon.code} - {coupon.description}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Loyalty Points Section */}

					<Typography variant="h6" gutterBottom>
						Loyalty Points
					</Typography>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography variant="body1">
							Available Points: {loyaltyPoints}
						</Typography>
						<FormControlLabel
							control={
								<Switch
									disabled={loyaltyPoints < 50000}
									checked={useLoyaltyPoints}
									onChange={handleLoyaltySwitch}
									color="primary"
								/>
							}
							label="Use Loyalty Points"
							labelPlacement="start"
						/>
					</Box>
				</>
			)}
			<hr className="my-4" />

			<Box display="flex" justifyContent="space-between" mb={5}>
				<Typography variant="h6" className="text-uppercase">
					Total price
				</Typography>
				<Typography variant="h6">
					{formatPrice(calculateTotal().toFixed(2))}
				</Typography>
			</Box>

			<Button
				variant="contained"
				color="success"
				onClick={handleSubmit}
				sx={{ fontWeight: "bold", width: "100%" }}
			>
				Checkout
			</Button>

			{toastMessage && (
				<ToastNoti
					message={toastMessage}
					type={toastType}
					position="top-right"
					autoClose={3000}
					onClose={handleToastReset}
				/>
			)}
		</Box>
	);
};

export default Summary;
