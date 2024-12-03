const mongoose = require('mongoose');
const { deserializeUser } = require('passport');

const typeValues = ['percentage', 'fixed'];

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true },

        quantity: { type: Number, default: 1 },

        type: {
            type: String,
            enum: typeValues,
            default: 'percentage',
        },

        discount: {
            type: Number,
            validate: {
                validator: function (value)  {
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

        usedBy: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
    },
    {
        timestamps: true,
    },
);


couponSchema.pre('save', function (next) {
    if (this.expirationDate && this.expirationDate < Date.now()) {
        return next(new Error('Expiration date must be in the future!'));
    }
    next();
});

module.exports = mongoose.model('Coupon', couponSchema);
