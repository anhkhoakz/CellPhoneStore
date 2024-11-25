const express = require('express');
const router = express.Router();
const { checkout } = require('~v1/controllers/checkOutController');

// Define the checkout route
router.post('/', checkout);

module.exports = router;
