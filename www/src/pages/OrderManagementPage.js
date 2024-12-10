import { Container, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import OrderCard from "../components/order/OrderCard";
import OrderEmpty from "../components/order/OrderEmpty";
import SearchBar from "../components/order/SearchBar";

import { useCookies } from "react-cookie";

const OrderManagementPage = () => {
    const [cookies] = useCookies([]);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/orders/myOrder`, {
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
                    product.name.toLowerCase().includes(query.toLowerCase()),
                ) || order._id.toString().includes(query),
        );
        setFilteredOrders(result);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
    };

    const filteredByStatus = orders.filter(
        (order) => statusFilter === "All" || order.status === statusFilter,
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
                filteredByStatus.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))
            )}
        </Container>
    );
};

export default OrderManagementPage;
