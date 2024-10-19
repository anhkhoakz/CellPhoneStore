import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

const Navigation = () => {
    return (
        <Navbar
            collapseOnSelect
            expand="lg"
            className="bg-body-tertiary custom-navbar"
        >
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/image/logo.png"
                        alt="Logo"
                        width="100%"
                        height="40"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <div className="search-container">
                        <Form className="search-form">
                            <Form.Control
                                type="search"
                                placeholder="What are you looking for?"
                                className="me-2"
                                aria-label="Search"
                            />
                        </Form>
                    </div>
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/orderManagement">
                            <i class="bi bi-box-seam m-1"></i>Orders
                        </Nav.Link>
                        <Nav.Link as={Link} to="/cart">
                            <i className="bi bi-cart"></i> Cart
                        </Nav.Link>
                        <Nav.Link as={Link} to="/login">
                            <i class="bi bi-person-circle m-1"></i>Login
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
