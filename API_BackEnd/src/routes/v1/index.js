// Initiate the express router
const homeRouter = require('./home');

const express = require('express');
const router = express.Router();

// Define the route for the home page
router.use('/', homeRouter);

module.exports = router;
