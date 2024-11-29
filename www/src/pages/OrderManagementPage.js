import React, { useState } from "react";
import { Container, Typography, Paper } from '@mui/material';
import OrderCard from "../components/OrderCard";
import SearchBar from "../components/SearchBar";
import OrderEmpty from "../components/OrderEmpty";

const OrderManagementPage = () => {
    const [orders] = useState([
        {
            id: 1, 
            status: 'In Transit', 
            products: [
                { id: 101, name: 'Product A', price: 50, amount: 2, image: 'https://via.placeholder.com/100' },
                { id: 102, name: 'Product B', price: 30, amount: 1, image: 'https://via.placeholder.com/100' }
            ], 
            total: 80,  
            date: '2024-10-01'
        },
        {
            id: 2, 
            status: 'Delivered', 
            products: [
                { id: 103, name: 'Product C', price: 100, amount: 1, image: 'https://via.placeholder.com/100' },
                { id: 104, name: 'Product D', price: 40, amount: 2, image: 'https://via.placeholder.com/100' }
            ], 
            total: 140, 
            date: '2024-09-25'
        },
        {
            id: 3, 
            status: 'In Transit', 
            products: [
                { id: 105, name: 'Product E', price: 60, amount: 1, image: 'https://via.placeholder.com/100' }
            ], 
            total: 60, 
            date: '2024-10-10'
        },
        {
            id: 4, 
            status: 'Delivered', 
            products: [
                { id: 106, name: 'Product F', price: 25, amount: 1, image: 'https://via.placeholder.com/100' },
                { id: 107, name: 'Product G', price: 75, amount: 2, image: 'https://via.placeholder.com/100' }
            ], 
            total: 100, 
            date: '2024-09-15'
        },
    ]);

    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [statusFilter, setStatusFilter] = useState('All');

    const handleSearch = (query) => {
        const result = orders.filter(order => 
            order.products.some(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            ) || order.id.toString().includes(query)
        );
        setFilteredOrders(result);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
    };

    const filteredByStatus = filteredOrders.filter(order => 
        statusFilter === 'All' || order.status === statusFilter
    );

    const inTransitOrders = filteredByStatus.filter(order => order.status === 'In Transit');
    const deliveredOrders = filteredByStatus.filter(order => order.status === 'Delivered');

    return (
        <Container sx={{minHeight: "90vh"}}>
            <Typography sx={{margin: "20px 0"}} variant="h4" align="center" gutterBottom>
                Order Management
            </Typography>
            <SearchBar onSearch={handleSearch} onStatusChange={handleStatusChange} />

            {inTransitOrders.length === 0 && deliveredOrders.length === 0 ? (
                <OrderEmpty />
            ) : (
                <>
                    {(statusFilter === 'All' || statusFilter === 'In Transit') && (
                        <Paper style={{ padding: '16px', margin: '16px 0' }}>
                            <Typography variant="h5" gutterBottom>
                                In Transit Orders
                            </Typography>
                            {inTransitOrders.length > 0 ? (
                                inTransitOrders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                <Typography align="center">No orders in transit.</Typography>
                            )}
                        </Paper>
                    )}

                    {(statusFilter === 'All' || statusFilter === 'Delivered') && (
                        <Paper style={{ padding: '16px', margin: '16px 0' }}>
                            <Typography variant="h5" gutterBottom>
                                Delivered Orders
                            </Typography>
                            {deliveredOrders.length > 0 ? (
                                deliveredOrders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                <Typography align="center">No delivered orders.</Typography>
                            )}
                        </Paper>
                    )}
                </>
            )}
        </Container>
    );
};

export default OrderManagementPage;
