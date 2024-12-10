import React, { useEffect, useState } from "react";
import TimedBanner from "../components/banner/TimedBanner";
import ProductList from "../components/product/ProductList";
import Category from "../components/product/Category";

const HomePage = () => {

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
                        ratings: product.productDetails.ratings,
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
