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
                claimedBy: { $nin: [userId] },
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
                claimedBy: { $in: [userId] },
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

    async ReceiveCoupon(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            const coupon = await Coupon.findOne({code: id});

            if (!coupon) {
                return res.status(404).json({
                    success: false,
                    message: "Coupon not found",
                });
            }

            if (coupon.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon out of stock",
                });
            }

            if (coupon.expiryDate < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon expired",
                });
            }

            if (coupon.claimedBy.includes(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon already received",
                });
            }

            coupon.quantity -= 1;
            coupon.quantityClaimed += 1;
            coupon.claimedBy.push(userId);

            await coupon.save();

            return res.status(200).json({
                success: true,
                message: "Coupon received successfully",
                data: coupon,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },

    async getCouponsByCondition(req, res) {
        try {
            const userId = req.user.userId;
            const {condition} = req.body;

           

            let coupons = await Coupon.find({ usedBy: { $nin: [userId] }, claimedBy: { $in: [userId] }, quantity: { $gt: 0 }, expiryDate: { $gte: new Date() } });

         
            if (!coupons) {
                return res.status(404).json({
                    success: false,
                    message: "Coupons not found",
                });
            }

            if (condition.minOrderValue) {
                coupons = coupons.filter((coupon) => 
                    coupon.condition?.minOrderValue !== undefined && // Ensure minOrderValue exists
                    Number(coupon.condition.minOrderValue) <= Number(condition.minOrderValue) // Convert to numbers before comparing
                );
            }
            

            if (Array.isArray(condition.applicableCategories) && condition.applicableCategories.length > 0) {
                coupons = coupons.filter((coupon) =>
                    condition.applicableCategories.every((category) =>
                        coupon.condition?.applicableCategories?.includes(category)
                    )
                );
            }

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
    }
};
