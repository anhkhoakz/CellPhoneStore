const express = require("express");
const router = express.Router();
const orderController = require("~v1/controllers/orderController");
const {
	updateOrderStatus,
	cancelOrder,
} = require("~v1/controllers/checkOutController");

const { verifyAccessToken } = require("~v1/middleware/tokenMiddleware");
const { route } = require("./homeRoutes");

router.get("/track/:orderId", orderController.trackOrder);
router.get("/myOrder", verifyAccessToken, orderController.getMyOrders);

router.get("/myOrder/:orderId", verifyAccessToken, orderController.getMyOrder);

router.get("/", orderController.getOrders);

router.patch("/:orderId", updateOrderStatus);

router.patch("/cancel/:orderId", cancelOrder);

router.patch(
	"/:orderId/rating",
	verifyAccessToken,
	orderController.ratingOrder,
);

module.exports = router;
