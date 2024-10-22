import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

const OrderItem = ({ product }) => {
    return (
        <Row className="mb-2">
            <Col md={3} className="d-flex justify-content-center">
                <Image src={product.image} rounded fluid />
            </Col>
            <Col md={9}>
                <h5>{product.name}</h5>
                <p>Price: ${product.price}</p>
                <p>Amount: {product.amount}</p>
            </Col>
        </Row>
    );
};

export default OrderItem;   
