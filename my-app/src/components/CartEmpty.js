import React from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

const CartEmpty = () => {
    return (
        <div className="text-center">
            <h3>Cart Empty</h3>
            <Link to="/" className="btn btn-primary mt-3">
                Back to shop
            </Link>
        </div>
    );
};

export default CartEmpty;
