<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const HomeController = require('~v1/controllers/homeController');
const { verifyAccessToken } = require('~v1/middleware/tokenMiddleware');

router.get('/', verifyAccessToken, HomeController.getHomePage);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const HomeController = require('~/apis/v1/controllers/homeController');

router.get('/', HomeController.getHomePage);

module.exports = router;
>>>>>>> 4469d3e85fcb1b7ad9ebb430f8d7d39720dbe161
