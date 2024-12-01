import React, { useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import OrderCard from "../components/OrderCard";
import SearchBar from "../components/SearchBar";
import OrderEmpty from "../components/OrderEmpty";

const OrderManagementPage = () => {
	const [orders] = useState([
		{
			id: 1,
			status: "In Transit",
			products: [
				{ id: 101, name: "Product A", price: 50, amount: 2, image: "https://via.placeholder.com/100" },
				{ id: 102, name: "Product B", price: 30, amount: 1, image: "https://via.placeholder.com/100" },
			],
			total: 80,
			date: "2024-10-01",
		},
		{
			id: 2,
			status: "Delivered",
			products: [
				{ id: 103, name: "Product C", price: 100, amount: 1, image: "https://via.placeholder.com/100" },
				{ id: 104, name: "Product D", price: 40, amount: 2, image: "https://via.placeholder.com/100" },
			],
			total: 140,
			date: "2024-09-25",
		},
		{
			id: 3,
			status: "In Transit",
			products: [{ id: 105, name: "Product E", price: 60, amount: 1, image: "https://via.placeholder.com/100" }],
			total: 60,
			date: "2024-10-10",
		},
		{
			id: 4,
			status: "Delivered",
			products: [
				{ id: 106, name: "Product F", price: 25, amount: 1, image: "https://via.placeholder.com/100" },
				{ id: 107, name: "Product G", price: 75, amount: 2, image: "https://via.placeholder.com/100" },
			],
			total: 100,
			date: "2024-09-15",
		},
		{
			id: 5,
			status: "Cancelled",
			products: [
				{ id: 108, name: "Product H", price: 80, amount: 1, image: "https://via.placeholder.com/100" },
				{ id: 109, name: "Product I", price: 20, amount: 2, image: "https://via.placeholder.com/100" },
			],
			total: 120,
			date: "2024-10-05",
		},
	]);

	const [filteredOrders, setFilteredOrders] = useState(orders);
	const [statusFilter, setStatusFilter] = useState("All");

	const handleSearch = (query) => {
		const result = orders.filter(
			(order) =>
				order.products.some((product) => product.name.toLowerCase().includes(query.toLowerCase())) ||
				order.id.toString().includes(query)
		);
		setFilteredOrders(result);
	};

	const handleStatusChange = (status) => {
		setStatusFilter(status);
	};

	const filteredByStatus = filteredOrders.filter((order) => statusFilter === "All" || order.status === statusFilter);

	const getColor = (color) => {
		if (color === "#fff3e0") return "#ff6d00";
		if (color === "#e8f5e9") return "#2e7d32";
		return "#c62828";
	};

	const renderOrders = (orders, title, color) => (
		<Paper sx={{ padding: 3, margin: "1em 0", backgroundColor: color, borderRadius: 2 }}>
			<Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: getColor(color) }}>
				{title}
			</Typography>
			{orders.length > 0 ? (
				orders.map((order) => <OrderCard key={order.id} order={order} />)
			) : (
				<Typography align="center" color="textSecondary">
					No {title.toLowerCase()}.
				</Typography>
			)}
		</Paper>
	);

	return (
		<Container sx={{ minHeight: "90vh", paddingTop: 4, paddingBottom: 4 }}>
			<Typography sx={{ margin: "1.25em 0", fontWeight: "bold" }} variant="h4" align="center" gutterBottom>
				Order Management
			</Typography>
			<SearchBar onSearch={handleSearch} onStatusChange={handleStatusChange} />

			{filteredByStatus.length === 0 ? (
				<OrderEmpty />
			) : (
				<>
					{(statusFilter === "All" || statusFilter === "In Transit") &&
						renderOrders(
							filteredByStatus.filter((order) => order.status === "In Transit"),
							"In Transit Orders",
							"#fff3e0"
						)}
					{(statusFilter === "All" || statusFilter === "Delivered") &&
						renderOrders(
							filteredByStatus.filter((order) => order.status === "Delivered"),
							"Delivered Orders",
							"#e8f5e9"
						)}
					{(statusFilter === "All" || statusFilter === "Cancelled") &&
						renderOrders(
							filteredByStatus.filter((order) => order.status === "Cancelled"),
							"Cancelled Orders",
							"#ffebee"
						)}
				</>
			)}
		</Container>
	);
};

export default OrderManagementPage;
