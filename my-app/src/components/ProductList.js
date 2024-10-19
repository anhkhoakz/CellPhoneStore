import React from "react";
import ProductCard from "./ProductCard"; // Import ProductCard

const ProductList = ({ title, products }) => {
    return (
        <div className="product-list-container">
            <h3>{title}</h3>
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-md-3 mb-4">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
