const express = require("express");
const router = express.Router();
const {
	CreateCoupon,
	GetCoupon,
	GetCoupons,
	UpdateCoupon,
	GetAvailableCoupons,
	getMyCoupons,
	ReceiveCoupon,
	getCouponsByCondition
} = require("~v1/controllers/couponController");

const {verifyAccessToken} = require("~v1/middleware/tokenMiddleware");

// Define the checkout route
router.post("/", CreateCoupon);
router.get("/", GetCoupons);


router.get("/available", verifyAccessToken, GetAvailableCoupons);
router.get("/my", verifyAccessToken, getMyCoupons);
router.get("/:id", GetCoupon);

router.post("/getCouponsByCondition",verifyAccessToken, getCouponsByCondition);


router.put("/:id", UpdateCoupon);

router.patch("/receive/:id", verifyAccessToken, ReceiveCoupon);

module.exports = router;
