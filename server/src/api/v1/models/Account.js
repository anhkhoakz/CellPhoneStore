const mongoose = require("mongoose");
const { comparePassword } = require("~v1/middleware/userMiddleware");

const userRoles = {
	CUSTOMER: "customer",
	ADMIN: "admin",
};

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			min: 6,
			max: 255,
			trim: true,
			required: true,
			index: true,
		},
		email: {
			type: String,
			min: 6,
			max: 255,
			trim: true,
			validate: {
				validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
				message: (props) => `${props.value} is not a valid email!`,
			},
			required: true,
			unique: true,
		},

		password: {
			type: String,
			min: 8,
			max: 124,
			// required: true,
		},

		phone: {
			type: String,
			min: 10,
			max: 10,
			trim: true,
		},

		addresses: [
			{
				village: { type: String, trim: true },
				city: { type: String, trim: true },
				district: { type: String, trim: true },
				detail: { type: String, trim: true },

				receiver: { type: String, trim: true },
				phone: { type: String, min: 10, max: 10, trim: true },

				isDefault: { type: Boolean, default: false },
			},
		],

		role: {
			type: String,
			enum: Object.values(userRoles),
			default: userRoles.CUSTOMER,
		},
		resetToken: { type: String, default: null },
		resetTokenExpiry: { type: Date, default: null },

		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},

		note: { type: String, trim: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

userSchema.methods.comparePassword = comparePassword;

module.exports = mongoose.model("Account", userSchema);
