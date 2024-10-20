import React from 'react';
import { Link } from "react-router-dom";


const OrderEmpty = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "60vh",
                color: "#155724",
                textAlign: "center",
                borderRadius: "10px",
                margin: "0 0 20px 0",
            }}
        >
            <h1>There are no orders here!</h1>
            <p>Sorry, we currently have no orders found !!!</p>
            <img
                src="/image/empty-box.png"
                alt="order-empty"
                style={{ marginTop: "20px", width: "250px", height: "auto" }} // Chỉnh kích thước hình ảnh
            />
            <div style={styles.linkContainer}>
                <Link to="/" style={styles.link}>
                    Continue shopping
                </Link>
            </div>
        </div>
    );
};

const styles = {
    linkContainer: {
        display: "flex",
        marginTop: "30px",
        gap: "20px",
    },
    link: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        textDecoration: "none",
        borderRadius: "5px",
        transition: "background-color 0.3s ease",
    },
};


export default OrderEmpty;
