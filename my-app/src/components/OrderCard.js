import React from 'react';
import { Card, Button } from 'react-bootstrap';
import OrderItem from './OrderItem';

const OrderCard = ({ order }) => {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Order #{order.id}</Card.Title>
                <Card.Text>Order Date: {order.date}</Card.Text>
                {order.products.map((product, index) => (
                    <React.Fragment key={index}>
                        <OrderItem product={product} />
                        {index < order.products.length - 1 && (
                            <hr style={{ width: '100%', margin: '20px auto' }} /> 
                        )}
                    </React.Fragment>
                ))}
                <Card.Text>Total: ${order.total}</Card.Text>
                {order.status === 'In Transit' ? (
                    <Button variant="primary">Track Order</Button>
                ) : (
                    <Button variant="success" disabled>Delivered</Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default OrderCard;
