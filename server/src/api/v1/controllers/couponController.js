
const Coupon = require('~v1/models/Coupon');

module.exports = {

    async CreateCoupon(req, res) {
        try {
            const { code, discount, type, expiryDate } = req.body;

            if (!code || !discount || !type || !expiryDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields',
                });
            }

            const coupon = await Coupon.create({
                code,
                discount,
                type,
                expiryDate,
            });

            return res.status(201).json({
                success: true,
                message: 'Coupon created successfully',
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
                    message: 'Coupon not found',
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
                    message: 'Coupon not found',
                });
            }

            coupon.code = code || coupon.code;
            coupon.discount = discount || coupon.discount;
            coupon.type = type || coupon.type;
            coupon.expiryDate = expiryDate || coupon.expiryDate;

            await coupon.save();

            return res.status(200).json({
                success: true,
                message: 'Coupon updated successfully',
                data: coupon,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },

}