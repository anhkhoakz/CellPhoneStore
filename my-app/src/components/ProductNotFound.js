import React from "react";

const NotFound = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "90vh",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                textAlign: "center",
                border: "1px solid #f5c6cb",
                borderRadius: "10px",
                margin: "-20px 0 0 0",
            }}
        >
            <h1>Product Not Found</h1>
            <p>
                The product you're looking for does not exist or has been
                removed.
            </p>
            <img
                src="https://img.icons8.com/ios-filled/100/000000/error.png"
                alt="error"
                style={{ marginTop: "20px" }}
            />
        </div>
    );
};

export default NotFound;
