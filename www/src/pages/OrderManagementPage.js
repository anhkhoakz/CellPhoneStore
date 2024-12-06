import React, { useEffect, useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import OrderCard from "../components/order/OrderCard";
import SearchBar from "../components/order/SearchBar";
import OrderEmpty from "../components/order/OrderEmpty";

import { useCookies } from "react-cookie";

const OrderManagementPage = () => {
    const [cookies] = useCookies([]);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                if (data.success) setOrders(data.message);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [cookies.accessToken]);

    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    
    const [statusFilter, setStatusFilter] = useState("All");

    const handleSearch = (query) => {
        const result = orders.filter(
            (order) =>
                order.items.some((product) =>
                    product.name.toLowerCase().includes(query.toLowerCase())
                ) || order._id.toString().includes(query)
        );
        setFilteredOrders(result);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
    };

    const filteredByStatus = filteredOrders.filter(
        (order) => statusFilter === "All" || order.status === statusFilter
    );

    const getColor = (color) => {
        if (color === "#fff3e0") return "#ff6d00";
        if (color === "#e8f5e9") return "#2e7d32";
        return "#c62828";
    };

    const renderOrders = (orders, title, color) => (
        <Paper
            sx={{
                padding: 3,
                margin: "1em 0",
                backgroundColor: color,
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", color: getColor(color) }}
            >
                {title}
            </Typography>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))
            ) : (
                <Typography align="center" color="textSecondary">
                    No {title.toLowerCase()}.
                </Typography>
            )}
        </Paper>
    );

    return (
        <Container
            sx={{
                minHeight: "90vh",
                paddingTop: 4,
                paddingBottom: 4,
                marginTop: "4em",
            }}
        >
            <Typography
                sx={{ marginBottom: "1em", fontWeight: "bold" }}
                variant="h4"
                align="center"
                gutterBottom
            >
                Order Management
            </Typography>
            <SearchBar
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
            />

            {filteredByStatus.length === 0 ? (
                <OrderEmpty />
            ) : (
                <>
                    {(statusFilter === "All" || statusFilter === "pending") &&
                        renderOrders(
                            filteredByStatus.filter(
                                (order) => order.status === "pending"
                            ),
                            "Pending Orders",
                            "#fff3e0"
                        )}

                    {(statusFilter === "All" || statusFilter === "confirmed") &&
                        renderOrders(
                            filteredByStatus.filter(
                                (order) => order.status === "confirmed"
                            ),
                            "Confirmed Orders",
                            "#fff3e0"
                        )}
                    {(statusFilter === "All" || statusFilter === "shipping") &&
                        renderOrders(
                            filteredByStatus.filter(
                                (order) => order.status === "shipping"
                            ),
                            "Shipping Orders",
                            "#fff3e0"
                        )}
                    {(statusFilter === "All" || statusFilter === "delivered") &&
                        renderOrders(
                            filteredByStatus.filter(
                                (order) => order.status === "delivered"
                            ),
                            "Delivered Orders",
                            "#e8f5e9"
                        )}
                    {(statusFilter === "All" || statusFilter === "cancelled") &&
                        renderOrders(
                            filteredByStatus.filter(
                                (order) => order.status === "cancelled"
                            ),
                            "Cancelled Orders",
                            "#ffebee"
                        )}
                </>
            )}
        </Container>
    );
};

export default OrderManagementPage;
