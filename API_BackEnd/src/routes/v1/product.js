const express = require('express');
const router = express.Router();
const ProductController = require('~v1/controllers/productController');

router.get('/', ProductController.getProducts);

module.exports = router;
