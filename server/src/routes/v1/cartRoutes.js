// Initiate the express router
const cartController = require('~v1/controllers/cartController');
const express = require('express');
const router = express.Router();
const {
    verifyAccessToken,
    optionalAuthenticateToken,
    combinedAuthMiddleware,
} = require('~v1/middleware/tokenMiddleware');

// Define the route for the home page
router.get('/', combinedAuthMiddleware, cartController.getCart);
router.post('/', combinedAuthMiddleware, cartController.addToCart);

router.post(
    '/shipping-fee',
    combinedAuthMiddleware,
    cartController.getShippingFee,
);

module.exports = router;
