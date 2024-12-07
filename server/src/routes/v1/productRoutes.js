const express = require("express");
const router = express.Router();
const ProductController = require("~v1/controllers/productController");
const path = require("node:path");
const { checkProductValidation } = require("~v1/middleware/productMiddleware");

const {
	combinedAuthMiddleware,
	verifyAccessToken,
} = require("~v1/middleware/tokenMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../../public/images"));
	},

	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now();
		cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

router.get("/", ProductController.searchProducts);

router.get("/page/", ProductController.List);

router.get("/:id", ProductController.getProductById);

// router.get('/search', ProductController.searchProducts);

router.get("/:category", ProductController.getProductsByCategory);

router.post(
	"/",
	upload.any(),
	checkProductValidation,
	ProductController.createProduct,
);

router.patch(
	"/:id",
	upload.any(),
	checkProductValidation,
	ProductController.updateProduct,
);

router.patch(
	"/:productId/comment",
	combinedAuthMiddleware,
	ProductController.addComment,
);

router.get("/:productId/comments", ProductController.getComments);

router.get("/:productId/rating", ProductController.getRatingScore);

router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
