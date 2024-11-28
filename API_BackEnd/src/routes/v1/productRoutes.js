const express = require('express');
const router = express.Router();
const ProductController = require('~v1/controllers/productController');
const path = require('path');
const { checkProuductValidation } = require('~v1/middleware/productMiddleware');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images'));
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get('/', ProductController.searchProducts);

router.get('/page/', ProductController.List);

router.get('/:id', ProductController.getProductById);

router.get('/:category', ProductController.getProductsByCategory);

router.post(
    '/',
    upload.any(),
    checkProuductValidation,
    ProductController.createProduct,
);

router.patch('/:id', upload.any(), checkProuductValidation,ProductController.updateProduct);

router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
