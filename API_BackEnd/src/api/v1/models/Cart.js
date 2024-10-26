const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            variantId: mongoose.Schema.Types.ObjectId,
        },
    ],
    totalPrice: Number,
    totalItems: Number,
});

module.exports = mongoose.model('Cart', cartSchema);
