import React, { useState } from "react";
import CartItem from "../components/CartItem";
import CartEmpty from "../components/CartEmpty";
import Summary from "../components/Summary"; // Import component Summary
import { Link } from "react-router-dom";

const CartPage = () => {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "iPhone 13 Pro",
            category: "Smartphone",
            quantity: 1,
            price: 999,
            image: "https://techland.com.vn/wp-content/uploads/2021/09/iphone-13-pro-graphite-select.png",
        },
        {
            id: 2,
            name: "Samsung Galaxy S21",
            category: "Smartphone",
            quantity: 1,
            price: 799,
            image: "https://cdn.tgdd.vn/Products/Images/42/236128/samsung-galaxy-s21-plus-256gb-bac-600x600-600x600.jpg",
        },
        {
            id: 3,
            name: "Google Pixel 6",
            category: "Smartphone",
            quantity: 1,
            price: 699,
            image: "https://cdn.tgdd.vn/Products/Images/42/233009/google-pixel-6-600x600.jpg",
        },
    ]);

    const [shipping, setShipping] = useState(5);

    const handleQuantityChange = (id, value) => {
        const newItems = items.map((item) =>
            item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + value) }
                : item
        );
        setItems(newItems);
    };

    const handleRemoveItem = (id) => {
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
    };

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const total = subtotal + shipping;

    return (
        <section className="h-100 h-custom">
            <div className="container h-100" style={{ marginBottom: "20px" }}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12">
                        <div
                            className="card card-registration card-registration-2"
                            style={{ borderRadius: "15px" }}
                        >
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    <div className="col-lg-8">
                                        <div className="p-5">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h2 className="fw-bold mb-0">
                                                    Shopping Cart
                                                </h2>
                                                <h6 className="mb-0 text-muted">
                                                    {items.length} items
                                                </h6>
                                            </div>
                                            <hr className="my-4" />
                                            {items.length === 0 ? (
                                                <CartEmpty />
                                            ) : (
                                                <>
                                                    {items.map((item) => (
                                                        <CartItem
                                                            key={item.id}
                                                            item={item}
                                                            onQuantityChange={
                                                                handleQuantityChange
                                                            }
                                                            onRemoveItem={
                                                                handleRemoveItem
                                                            }
                                                        />
                                                    ))}
                                                    <div className="d-flex justify-content-between">
                                                        <h5 className="text-uppercase">
                                                            Price
                                                        </h5>
                                                        <h5>
                                                            ${" "}
                                                            {subtotal.toFixed(
                                                                2
                                                            )}
                                                        </h5>
                                                    </div>
                                                    <hr className="my-4" />
                                                    <div>
                                                        <h6 className="mb-0">
                                                            <Link to="/">
                                                                Back to shop
                                                            </Link>
                                                        </h6>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Chỉ hiển thị Summary khi giỏ hàng không trống */}
                                    {items.length > 0 && (
                                        <div className="col-lg-4 bg-body-tertiary">
                                            <Summary
                                                subtotal={subtotal}
                                                total={total}
                                                shipping={shipping}
                                                setShipping={setShipping}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartPage;
