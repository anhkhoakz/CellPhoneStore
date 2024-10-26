const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            variantId: mongoose.Schema.Types.ObjectId,
            price: Number,
        },
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipping', 'delivered'],
        default: 'pending',
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        contactNumber: String,
    },
    paymentConfirmed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Order', orderSchema);
