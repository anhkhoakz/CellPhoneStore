const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, maxLength: 255, required: true },
    price: { type: Number, required: true },
    description: { type: String, maxLength: 600, required: true },
    image: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', Product);
