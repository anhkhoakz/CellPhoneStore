const mongoose = require('mongoose');
const { deserializeUser } = require('passport');

const typeValues = ['percentage', 'fixed'];

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true },

        quantity: { type: Number, default: 1 },

        quantityClaimed: { type: Number, default: 0 },

        quantityUsed: { type: Number, default: 0 },

        condition: {
            type: Object,
            default: {},
            validate: {
                validator: function (value) {
                    if (value.minOrderValue && value.minOrderValue < 0) {
                        return false;
                    }
                    if (value.applicableCategories && !Array.isArray(value.applicableCategories)) {
                        return false;
                    }
                    return true;
                },
                message: 'Invalid condition format!',
            },
        },


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
                        return value <= 1000000 && value > 0;
                    }
                    return false;
                },
                message: (props) =>
                    `${props.value} is not a valid discount value!`,
            },
            required: true,
        },

        expiryDate: {
            type: Date,
            validate: {
                validator: (value) => {
                    return !value || value > Date.now();
                },
                message: 'Expiration date must be in the future!',
            },
        },

        description: { type: String },

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
