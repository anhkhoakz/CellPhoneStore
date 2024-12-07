const productService = require("~v1/services/ProductService");

// Get all products
/**
 * Get all products
 *
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>} The response object
 */
const getAllProducts = async (req, res) => {
	try {
		const products = await productService.getAllProducts();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get a product by ID
const getProductById = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await productService.getProductById(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Create a new product
const createProduct = async (req, res) => {
	try {
		// Handle primary image (ensure it exists)
		const primaryImage = req.files?.image ? req.files.image[0].path : null;
		// Handle additional images (ensure they exist)
		const additionalImages = req.files?.images
			? req.files.images.map((file) => file.path)
			: [];

		// Create the product data object
		const productData = {
			...req.body,
			image: primaryImage, // Set the main image
			images: additionalImages, // Set the array of additional images
		};

		// Create the product using the productService
		const product = await productService.createProduct(productData);

		// Return the created product as a response
		res.status(201).json(product);
	} catch (error) {
		console.error("🚀 ~ createProduct ~ error:", error);
		res.status(500).json({
			error: "An error occurred while creating the product.",
		});
	}
};

const updateProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await productService.updateProduct(id, req.body);
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		await productService.deleteProduct(id);
		res.status(200).json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
