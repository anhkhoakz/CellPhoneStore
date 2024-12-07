const Loyalty = require("~v1/models/Loyalty");

module.exports = {
    async getLoyaltyPoints(req, res) {
        try {
            const userId = req.user.UserId;

            const loyaltyPoints = await Loyalty.findOne({ userId });

            if (!loyaltyPoints) {
                return res.status(200).json({
                    success: true,
                    message: { pointsEarned: 0 },
                });
            }

            return res.status(200).json({
                success: true,
                message: { pointsEarned: loyaltyPoints.pointsEarned },
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

};