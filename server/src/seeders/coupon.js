const mongoose = require("mongoose");
const { deserializeUser } = require("passport");

const typeValues = ["percentage", "fixed"];

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
				validator: (value) => {
					if (value.minOrderValue && value.minOrderValue < 0) {
						return false;
					}
					if (
						value.applicableCategories &&
						!Array.isArray(value.applicableCategories)
					) {
						return false;
					}
					return true;
				},
				message: "Invalid condition format!",
			},
		},

		type: {
			type: String,
			enum: typeValues,
			default: "percentage",
		},

		discount: {
			type: Number,
			validate: {
				validator: function (value) {
					if (this.type === "percentage") {
						return value <= 50 && value > 0;
					}
					if (this.type === "fixed") {
						return value <= 1000000 && value > 0;
					}
					return false;
				},
				message: (props) => `${props.value} is not a valid discount value!`,
			},
			required: true,
		},

		expiryDate: {
			type: Date,
			validate: {
				validator: (value) => {
					return !value || value > Date.now();
				},
				message: "Expiration date must be in the future!",
			},
		},

		description: { type: String, required: true },



		usedBy: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},

		claimedBy: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

couponSchema.pre("save", function (next) {
	if (this.expirationDate && this.expirationDate < Date.now()) {
		return next(new Error("Expiration date must be in the future!"));
	}
	next();
});

const Coupon = mongoose.model("Coupon", couponSchema);


const seedCoupons = async () => {
    try {

        await mongoose.connect("mongodb://mongo:27017/CellPhoneStore"
        );

        // Clear existing coupons
        await Coupon.deleteMany({});
        console.log("Existing coupons cleared.");

        // Seed data
        const coupons = [
            {
                code: "WELCOME10",
                quantity: 100,
                condition: { minOrderValue: 0, applicableCategories: ["phone", "tablet", "headphone", "laptop" ] },
                type: "percentage",
                discount: 20,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                description: "20% off on your first order",
            },
            {
                code: "FIXED50",
                quantity: 50,
                condition: { minOrderValue: 4000000, applicableCategories: ["phone"] },
                type: "fixed",
                discount: 500000,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                description: "Get 500.000 VNX off on orders above 40.000.000 VND",
            },
            {
                code: "SUMMER20",
                quantity: 20,
                condition: { minOrderValue: 100, applicableCategories: ["phone", "tablet", "headphone", "laptop" ] },
                type: "percentage",
                discount: 10,
                expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                description: "10% off during summer",
            },
        ];

        // Insert seed data
        await Coupon.insertMany(coupons);
        console.log("Coupons seeded successfully.");
    } catch (error) {
        console.error("Error seeding coupons:", error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seed function
seedCoupons();