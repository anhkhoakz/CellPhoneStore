const express = require('express');
const router = express.Router();
const HomeController = require('~v1/controllers/homeController');
const { verifyAccessToken } = require('~v1/middleware/tokenMiddleware');

router.get('/',  verifyAccessToken, HomeController.getHomePage);

module.exports = router;
