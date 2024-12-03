const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [
        {
            productId: {
                type: Number,
                ref: 'Product',
                required: true,
            },
            quantity: { type: Number, required: true, default: 1 },
            variantId: mongoose.Schema.Types.ObjectId,
        },
    ],

    taxes: Number,
    shippingFee: Number,
    totalPrice: Number,
    totalItems: Number,
});

module.exports = mongoose.model('Cart', cartSchema);
