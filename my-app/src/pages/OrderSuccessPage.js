import React from "react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
                backgroundColor: "#d4edda",
                color: "#155724",
                textAlign: "center",
                border: "1px solid #c3e6cb",
                borderRadius: "10px",
                margin: "-20px 0 0 0",
            }}
        >
            <h1>Purchase successful!</h1>
            <p>Thank you for your purchase. Your order will be shipped soon!</p>
            <img
                src="/image/car.png"
                alt="success"
                style={{ marginTop: "20px", width: "250px", height: "auto" }} // Chỉnh kích thước hình ảnh
            />
            <div style={styles.linkContainer}>
                <Link to="/" style={styles.link}>
                    Quay lại trang chủ
                </Link>
                <Link to="/orderManagement" style={styles.link}>
                    Quản lý đơn hàng
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

export default OrderSuccessPage;
