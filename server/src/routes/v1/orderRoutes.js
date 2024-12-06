const express = require('express');
const router = express.Router();
const orderController = require('~v1/controllers/orderController');

const { verifyAccessToken } = require('~v1/middleware/tokenMiddleware');

router.get('/track/:orderId', orderController.trackOrder);
router.get('/', verifyAccessToken, orderController.getOrders);


module.exports = router;
