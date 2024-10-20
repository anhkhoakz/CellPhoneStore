import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
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

    const [filteredOrders, setFilteredOrders] = useState(orders); // Trạng thái cho kết quả tìm kiếm
    const [statusFilter, setStatusFilter] = useState('All'); // Trạng thái cho bộ lọc trạng thái đơn hàng

    const handleSearch = (query) => {
        const result = orders.filter(order => 
            // Tìm kiếm theo tên sản phẩm hoặc ID đơn hàng
            order.products.some(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            ) || order.id.toString().includes(query)
        );
        setFilteredOrders(result);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status); // Cập nhật trạng thái bộ lọc
    };

    const filteredByStatus = filteredOrders.filter(order => 
        statusFilter === 'All' || order.status === statusFilter
    );

    const inTransitOrders = filteredByStatus.filter(order => order.status === 'In Transit');
    const deliveredOrders = filteredByStatus.filter(order => order.status === 'Delivered');

    return (
        <Container>
            <h2 className="text-center my-4">Order Management</h2>
            <SearchBar onSearch={handleSearch} onStatusChange={handleStatusChange} />

            {/* Kiểm tra nếu cả 2 danh sách đều trống, hiển thị OrderEmpty */}
            {inTransitOrders.length === 0 && deliveredOrders.length === 0 ? (
                <OrderEmpty />
            ) : (
                <>
                    {/* Phần "In Transit Orders" - chỉ hiển thị khi không lọc "Delivered" */}
                    {(statusFilter === 'All' || statusFilter === 'In Transit') && (
                        <Row>
                            <Col>
                                <h4 className="mb-3">In Transit Orders</h4>
                                {inTransitOrders.length > 0 ? (
                                    inTransitOrders.map(order => (
                                        <OrderCard key={order.id} order={order} />
                                    ))
                                ) : (
                                    <h3 className="text-center">No orders in transit.</h3>
                                )}
                            </Col>
                        </Row>
                    )}

                    {/* Phần "Delivered Orders" - chỉ hiển thị khi không lọc "In Transit" */}
                    {(statusFilter === 'All' || statusFilter === 'Delivered') && (
                        <Row style={{marginTop: '6vh'}}>
                            <Col>
                                <h4 className="mb-3">Delivered Orders</h4>
                                {deliveredOrders.length > 0 ? (
                                    deliveredOrders.map(order => (
                                        <OrderCard key={order.id} order={order} />
                                    ))
                                ) : (
                                    <h3 className="text-center">No delivered orders.</h3>
                                )}
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </Container>
    );
};

export default OrderManagementPage;
