import React from "react";

const ProductCard = ({ product }) => {
    return (
        <div>
            <div className="col-md-12 mb-4">
                <div className="card shadow">
                    <img
                        src={product.image}
                        className="card-img-top product-image"
                        alt={product.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">${product.price}</p>
                        <div className="button-container">
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary addBtn shadow-0"
                                >
                                    <i className="bi bi-cart"></i> Add to cart
                                </button>
                            </div>
                            <div>
                                <button className="btn btn-success buyBtn">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
