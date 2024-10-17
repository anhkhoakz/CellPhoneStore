const express = require('express');
const router = express.Router();
const HomeController = require('~/apis/v1/controllers/homeController');

router.get('/', HomeController.getHomePage);

module.exports = router;
