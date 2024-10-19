// Initiate the express router
const homeRouter = require('./home');
const productRouter = require('./product');
const UserRouter = require('./userRoutes');

const express = require('express');
const router = express.Router();

// Define the route for the home page
router.use('/', homeRouter);
router.use('/products', productRouter);
router.use('/users', UserRouter);

module.exports = router;
