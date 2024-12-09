import React, { useEffect, useState } from "react";
import TimedBanner from "../components/banner/TimedBanner";
import ProductList from "../components/product/ProductList";
import Category from "../components/product/Category";

const HomePage = () => {
    // Sample data for products
    const products = [
        {
            id: 1,
            name: "Product 1",
            price: 29.99,
            image: "image/ip16.jpg",
            isHot: true,
            isNew: true,
        },
        {
            id: 2,
            name: "Product 2",
            price: 39.99,
            image: "/image/ip16.jpg",
            isHot: false,
            isNew: true,
        },
        {
            id: 3,
            name: "Product 3",
            price: 19.99,
            image: "/image/ip16.jpg",
            isHot: true,
        },
        {
            id: 4,
            name: "Product 4",
            price: 19.99,
            image: "/image/ip16.jpg",
            isHot: false,
        },
    ];

    const categories = [
        { name: "Phone" },
        { name: "Laptop" },
        { name: "Tablet" },
        { name: "Headphone" },
    ];

    const [hotProducts, setHotProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        // Fetch hot products
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/newest`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    const updatedProducts = data.message.map((product) => ({
                        ...product,
                        isNew: true,
                    }));
                    setNewProducts(updatedProducts);
                }
            });

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/hot`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    const updatedProducts = data.data.map((product) => ({
                        name: product.productDetails.name,
                        productId: product.productId,
                        price: product.productDetails.price,
                        image: product.productDetails.image,
                        description: product.productDetails.description,
                        isHot: true,
                    }));

                    setHotProducts(updatedProducts);
                }
            });
        // // Fetch new products
        // fetch("http://localhost:3000/products/new")
        // 	.then((response) => response.json())
        // 	.then((data) => setNewProducts(data));
    }, []);

    return (
        <div>
            <TimedBanner />
            <Category categories={categories} />
            <ProductList title="HOT PRODUCTS" products={hotProducts} />
            <ProductList title="NEW PRODUCTS" products={newProducts} />
        </div>
    );
};

export default HomePage;
