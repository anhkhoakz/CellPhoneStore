const mongoose = require('mongoose');

const typeValues = ['percentage', 'fixed'];

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true, required: true },

        type: {
            type: String,
            enum: typeValues,
            default: 'percentage',
        },

        discount: {
            type: Number,
            validate: {
                validator: (value) => {
                    if (this.type === 'percentage') {
                        return value <= 50 && value > 0;
                    } else if (this.type === 'fixed') {
                        return value <= 100 && value > 0;
                    }
                    return false;
                },
                message: (props) =>
                    `${props.value} is not a valid discount value!`,
            },
            required: true,
        },

        expirationDate: {
            type: Date,
            validate: {
                validator: (value) => {
                    return !value || value > Date.now();
                },
                message: 'Expiration date must be in the future!',
            },
        },
        isUsed: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Coupon', couponSchema);
