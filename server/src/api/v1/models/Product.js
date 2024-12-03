const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const categoryValues = ['phone', 'laptop', 'ipad'];

const productSchema = new Schema({
    name: { type: String, maxLength: 255, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, maxLength: 600 },
    category: {
        type: String,
        enum: categoryValues,
        required: true,
    },
    productId: { type: Number, unique: true },
    stock: { type: Number, required: true },

    sold: { type: Number, default: 0 },

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

productSchema.plugin(mongooseSequence, {
    inc_field: 'productId',
    start_seq: 1,
});

module.exports = mongoose.model('Product', productSchema);
