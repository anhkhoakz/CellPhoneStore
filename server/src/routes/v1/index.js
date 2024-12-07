// Initiate the express router
const homeRouter = require("./homeRoutes");
const productRouter = require("./productRoutes");
const UserRouter = require("./userRoutes");
const cartRouter = require("./cartRoutes");
const checkoutRouter = require("./checkoutRoute");

const express = require("express");
const router = express.Router();

// Define the route for the home page
router.use("/", homeRouter);
router.use("/products", productRouter);
router.use("/users", UserRouter);
router.use("/cart", cartRouter);
router.use("/checkout", checkoutRouter);

router.use("/orders", require("./orderRoutes"));

router.use("/coupons", require("./couponRoutes"));

module.exports = router;
