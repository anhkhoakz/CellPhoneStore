const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryValues = ['phone', 'laptop', 'ipad'];

const productSchema = new Schema({
    name: { type: String, maxLength: 255, required: true },
    price: { type: Number, required: true },
    description: { type: String, maxLength: 600 },
    category: {
        type: String,
        enum: categoryValues,
        required: true,
    },
    stock: { type: Number, required: true },

    variants: [
        {
            name: String,
            stock: Number,
            price: Number,
            image: String,
        },
    ],

    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: Number,
            comment: String,
        },
    ],

    image: { type: String, required: true },
    images: [{ type: String }],

    createAt: { type: Date, default: Date.now, immutable: true },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
