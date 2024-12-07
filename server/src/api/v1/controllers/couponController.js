const { get } = require("mongoose");
const Coupon = require("~v1/models/Coupon");

module.exports = {
	async CreateCoupon(req, res) {
		try {
			const {
				code,
				discount,
				type,
				expiryDate,
				quantity,
				condition,
				description,
			} = req.body;

			if (
				!code ||
				!discount ||
				!type ||
				!expiryDate ||
				!quantity ||
				!condition
			) {
				return res.status(400).json({
					success: false,
					message: "Please provide all required fields",
				});
			}

			console.log("Received expiryDate:", expiryDate);

			const coupon = await Coupon.create({
				code,
				discount,
				type,
				expiryDate: new Date(expiryDate),
				quantity,
				description,
				condition,
			});

			return res.status(201).json({
				success: true,
				message: "Coupon created successfully",
				data: coupon,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	async GetCoupons(req, res) {
		try {
			const coupons = await Coupon.find({});

			return res.status(200).json({
				success: true,
				data: coupons,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	async GetCoupon(req, res) {
		try {
			const { id } = req.params;

			const coupon = await Coupon.findById(id);

			if (!coupon) {
				return res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
			}

			return res.status(200).json({
				success: true,
				data: coupon,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	async UpdateCoupon(req, res) {
		try {
			const { id } = req.params;
			const { code, discount, type, expiryDate } = req.body;

			const coupon = await Coupon.findById(id);

			if (!coupon) {
				return res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
			}

			coupon.code = code || coupon.code;
			coupon.discount = discount || coupon.discount;
			coupon.type = type || coupon.type;
			coupon.expiryDate = expiryDate || coupon.expiryDate;

			await coupon.save();

			return res.status(200).json({
				success: true,
				message: "Coupon updated successfully",
				data: coupon,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	async GetAvailableCoupons(req, res) {
		try {

			const userId = req.user.userId;

			const coupons = await Coupon.find({
				quantity: { $gt: 0 },
				expiryDate: { $gte: new Date() },
				users: { $nin: [userId] },
			});

			return res.status(200).json({
				success: true,
				data: coupons,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	async getMyCoupons(req, res) {
		try {
			const userId = req.user.userId;

			const coupons = await Coupon.find({
				users: { $in: [userId] },
			});

			return res.status(200).json({
				success: true,
				data: coupons,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	},

	async ApplyCoupon(req, res) {
		try {
			const { code } = req.body;
			const userId = req.user.userId;

			const coupon = await Coupon.findOne ({ code });

			if (!coupon) {
				return res.status(404).json({
					success: false,
					message: "Coupon not found",
				});
			}

			if (coupon.quantity <= 0) {
				return res.status(400).json({
					success: false,
					message: "Coupon has been exhausted",
				});
			}

			if (coupon.expiryDate < new Date()) {
				return res.status(400).json({
					success: false,
					message: "Coupon has expired",
				});
			}

			const user = await User.findById(userId);

			if (coupon.condition > user.totalAmount) {
				return res.status(400).json({
					success: false,
					message: "You do not meet the coupon condition",
				});
			}

			user.totalAmount -= coupon.discount;

			coupon.quantity -= 1;

			user.coupons.push(coupon._id);

			await user.save();
			await coupon.save();

			return res.status(200).json({
				success: true,
				message: "Coupon applied successfully",
			});

		}
		catch (error) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}
};
