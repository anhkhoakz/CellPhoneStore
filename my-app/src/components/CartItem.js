import React from "react";

const CartItem = ({ item, onQuantityChange, onRemoveItem }) => {
    const handleInputChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity >= 0) {
            onQuantityChange(item.id, newQuantity - item.quantity); // Tính toán sự thay đổi về số lượng
        }
    };

    return (
        <div className="row d-flex justify-content-between align-items-center">
            <div className="col-md-2 col-lg-2 col-xl-2">
                <img
                    src={item.image}
                    className="img-fluid rounded-3"
                    alt={item.name}
                />
            </div>
            <div className="col-md-3 col-lg-3 col-xl-3">
                <h6>{item.name}</h6>
                <h6 className="text-muted">{item.category}</h6>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                <button
                    className="btn btn-link px-2"
                    style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() => onQuantityChange(item.id, -1)}
                >
                    <i className="bi bi-dash"></i>
                </button>

                <input
                    min="0"
                    name="quantity"
                    value={item.quantity}
                    type="number"
                    className="form-control form-control-sm"
                    onChange={handleInputChange}
                    style={{
                        textAlign: "center",
                        width: "50px",
                        margin: "0 5px",
                    }}
                />

                <button
                    className="btn btn-link px-2"
                    style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        cursor: "pointer",
                    }}
                    onClick={() => onQuantityChange(item.id, 1)}
                >
                    <i className="bi bi-plus"></i>
                </button>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 className="mb-0">$ {item.price}</h6>
            </div>
            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                <a
                    href="#!"
                    className="text-muted"
                    onClick={() => onRemoveItem(item.id)}
                >
                    <i className="bi bi-x-lg"></i>
                </a>
            </div>
            <hr className="my-4" />
        </div>
    );
};

export default CartItem;
