import React, { useState } from "react";

const Summary = ({ subtotal, total, shipping, setShipping }) => {
    // Thêm state cho tên, số điện thoại, địa chỉ
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = () => {
        // Xử lý dữ liệu khi người dùng nhấn nút Register
        console.log("Customer Information:", { name, phone, address });
        console.log("Shipping:", shipping);
        console.log("Total Price:", total);
    };

    return (
        <div className="p-5">
            <h3 className="fw-bold mb-4 pt-1">Customer Information</h3>
            <div className="form-floating mb-4">
                <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                />
                <label htmlFor="floatingName">Full Name</label>
            </div>

            <div className="form-floating mb-4">
                <input
                    type="tel"
                    className="form-control"
                    id="floatingPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                />
                <label htmlFor="floatingPhone">Phone Number</label>
            </div>

            <div className="form-floating mb-4">
                <textarea
                    className="form-control"
                    id="floatingAddress"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Shipping Address"
                    style={{ height: "100px" }}
                    required
                ></textarea>
                <label htmlFor="floatingAddress">Shipping Address</label>
            </div>
            <hr className="my-4" />
            <h3 className="fw-bold mb-4 pt-1">Summary</h3>
            <h5 className=" mb-3">Shipping</h5>
            <div className="mb-4 pb-2">
                <select
                    className="form-select"
                    onChange={(e) => setShipping(Number(e.target.value))}
                    value={shipping}
                >
                    <option value="5">Standard Delivery - $5.00</option>
                    <option value="10">Express Delivery - $10.00</option>
                </select>
            </div>

            <h5 className=" mb-3">Discount Code</h5>
            <div className="form-floating mb-5">
                <input
                    type="text"
                    className="form-control"
                    id="floatingCode"
                    placeholder="Enter your code"
                />
                <label htmlFor="floatingCode">Enter your code</label>
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between mb-5">
                <h5 className="text-uppercase">Total price</h5>
                <h5>$ {total.toFixed(2)}</h5>
            </div>

            <button
                type="button"
                className="btn btn-success btn-lg"
                style={{ fontWeight: "bold", width: "100%" }}
                onClick={handleSubmit}
            >
                Register
            </button>
        </div>
    );
};

export default Summary;
