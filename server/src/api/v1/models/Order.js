const mongoose = require("mongoose");
const Coupon = require("./Coupon");

const statusValue = [
	"pending",
	"confirmed",
	"shipping",
	"delivered",
	"cancelled",
];
const shippingOption = ["standard", "express"];

const orderSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	items: [
		{
			productId: { type: Number, ref: "Product" },
			quantity: Number,
			variantId: mongoose.Schema.Types.ObjectId,
			image: String,
			name: String,
			price: Number,
		},
	],

	totalAmount: { type: Number, required: true },

	status: {
		type: String,
		enum: statusValue,
		default: "pending",
	},

	shippingOption: {
		type: String,
		enum: shippingOption,
		default: "standard",
		required: true,
	},

	// orderNumber: { type: String, unique: true, required: true },
	paymentConfirmed: { type: Boolean, default: false },

	shippingAddress: {
		city: { type: String, required: true },
		district: { type: String, required: true },
		village: { type: String, required: true },
		detail: { type: String, required: true },
		phone: { type: String, required: true },
		name: { type: String, required: true },
	},

	pointsRedeemed: { type: Number, default: 0 },

	coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },

	noted: { type: String },

	isRating: { type: Boolean, default: false },

	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
