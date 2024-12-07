const express = require("express");
const router = express.Router();
const {
	CreateCoupon,
	GetCoupon,
	GetCoupons,
	UpdateCoupon,
} = require("~v1/controllers/couponController");

// Define the checkout route
router.post("/", CreateCoupon);
router.get("/", GetCoupons);
router.get("/:id", GetCoupon);
router.put("/:id", UpdateCoupon);

module.exports = router;
