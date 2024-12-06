const express = require('express');
const router = express.Router();
const orderController = require('~v1/controllers/orderController');

const { verifyAccessToken } = require('~v1/middleware/tokenMiddleware');
const { route } = require('./homeRoutes');

router.get('/track/:orderId', orderController.trackOrder);
router.get('/myOrder', verifyAccessToken, orderController.getMyOrders);

router.get('/', orderController.getOrders);
module.exports = router;
