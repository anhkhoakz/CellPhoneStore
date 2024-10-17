import React from "react";
import ProductNotFound from "../components/ProductNotFound";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";

const ProductDetail = () => {
    const product = {
        id: 1,
        name: "iPhone 13",
        price: 999,
        description:
            "The iPhone 13 is one of Apple's standout smartphones, launched in September 2021. With its sleek design, the iPhone 13 features an aluminum frame and a glass back, available in a variety of colors including Black, White, Product Red, Blue, Green, and Pink.",
        image: "https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-xanh-la-thumb-new-600x600.jpg",
    };

    const relaProducts = [
        {
            id: 1,
            name: "Product 1",
            price: 29.99,
            image: "/image/ip16.jpg",
        },
        {
            id: 2,
            name: "Product 2",
            price: 39.99,
            image: "/image/ip16.jpg",
        },
        {
            id: 3,
            name: "Product 3",
            price: 19.99,
            image: "/image/ip16.jpg",
        },
        {
            id: 4,
            name: "Product 3",
            price: 19.99,
            image: "/image/ip16.jpg",
        },
    ];
    const { id } = useParams();

    // Kiểm tra xem ID trong URL có khớp với ID của sản phẩm không
    if (parseInt(id) !== product.id) {
        return <ProductNotFound />;
    }

    return (
        <div>
            {/* Product Detail */}
            <section className="py-5">
                <div className="container" style={{ minHeight: "60vh" }}>
                    <div className="row gx-5">
                        <aside className="col-lg-6">
                            <div
                                className="border rounded-4 mb-3 d-flex justify-content-center"
                                style={{
                                    width: "400px",
                                    height: "400px",
                                    margin: "auto",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    style={{
                                        maxWidth: "90%",
                                        maxHeight: "50vh",
                                        margin: "auto",
                                    }} // Thay đổi kích thước ảnh
                                    className="rounded-4 fit"
                                    src={product.image}
                                    alt={product.name}
                                />
                            </div>
                        </aside>

                        <main className="col-lg-6">
                            <div className="ps-lg-3">
                                <h4 className="title text-dark">
                                    {product.name}
                                </h4>
                                <div className="d-flex flex-row my-3">
                                    <span className="text-success">
                                        In stock
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <span className="h5">${product.price}</span>
                                </div>

                                <p>{product.description}</p>

                                <hr />

                                <div className="row mb-4">
                                    <div className="col-md-4 col-6">
                                        <label className="mb-2">Color</label>
                                        <select
                                            className="form-select border border-secondary"
                                            style={{ height: "35px" }}
                                        >
                                            <option>Black</option>
                                            <option>White</option>
                                            <option>Blue</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-success shadow-0"
                                >
                                    Buy now
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary shadow-0 mx-2"
                                >
                                    <i className="bi bi-cart"></i> Add to cart
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
            <hr
                style={{
                    maxWidth: "80%",
                    margin: "auto",
                    padding: "10px",
                }}
            />
            <div>
                <ProductList title="Similar items" products={relaProducts} />
            </div>
        </div>
    );
};

export default ProductDetail;
