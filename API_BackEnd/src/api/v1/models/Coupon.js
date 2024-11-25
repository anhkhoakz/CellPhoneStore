const mongoose = require('mongoose');

const typeValues = ['percentage', 'fixed'];

const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true },

    type: {
        type: String,
        enum: typeValues,
        default: 'percentage',
    },

    discount: {
        type: Number,
        validate: {
            validator: function (value) {
                if (this.type === 'percentage') {
                    return value <= 50 && value > 0;
                } else if (this.type === 'fixed') {
                    return value <= 100 && value > 0;
                }
                return false;
            },
            message: (props) => `${props.value} is not a valid discount value!`,
        },
        required: true,
    },

    expirationDate: Date,
    isUsed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Coupon', couponSchema);
