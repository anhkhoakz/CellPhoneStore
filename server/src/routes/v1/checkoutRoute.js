const express = require('express');
const router = express.Router();
const { checkout } = require('~v1/controllers/checkOutController');

const {
    verifyAccessToken,
    optionalAuthenticateToken,
    combinedAuthMiddleware,
} = require('~v1/middleware/tokenMiddleware');

// Define the checkout route
router.post('/',combinedAuthMiddleware, checkout);




module.exports = router;
