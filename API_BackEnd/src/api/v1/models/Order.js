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

    shippingOption: {
        type: String,
        enum: ['standard', 'express'],
        default: 'standard',
        required: true,
    },

    // orderNumber: { type: String, unique: true, required: true },
    paymentConfirmed: { type: Boolean, default: false },

    shippingAddress: {
        city: String,
        district: String,
        street: String,
        zip: String,
        contactNumber: String,
    },
});

module.exports = mongoose.model('Order', orderSchema);
