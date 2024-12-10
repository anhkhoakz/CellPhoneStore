const elasticService = require("~v1/services/elasticSearch.service");
const Product = require("~v1/models/Product"); // Assuming you have a model for products

// Get all products from the database
/**
 * Get all products
 *
 * @async
 * @returns {Promise<Array>} The array of products
 */
const getAllProducts = async () => {
	try {
		// Call Elasticsearch to search for all documents
		const response = await elasticService.searchDocument("products", {
			query: {
				match_all: {}, // Match all documents in the "products" index
			},
		});

		// Ensure there are hits and map the results
		if (response?.hits?.hits) {
			// Map through the hits and return only the _source (the product data)
			return response.hits.hits.map((product) => product._source);
		}
		throw new Error("No products found");
	} catch (error) {
		// Log the error and throw it
		console.error("Error fetching all products:", error);
		throw new Error(`Error fetching products: ${error.message}`);
	}
};

// Get a product by ID from Elasticsearch (or database fallback)
const getProductById = async (id) => {
	try {
		// First, check Elasticsearch for the product
		const response = await elasticService.searchDocument("products", {
			query: {
				term: { id: id }, // Make sure 'id' is correctly indexed in Elasticsearch
			},
		});

		if (response.hits.total.value === 0) {
			// Fallback to the database if not found in Elasticsearch
			return await Product.findById(id);
		}

		// Return the product from Elasticsearch
		return response.hits.hits[0]._source;
	} catch (error) {
		throw new Error(`Error fetching product by ID: ${error.message}`);
	}
};

// Create a new product and store it in both Elasticsearch and the database
const createProduct = async (productData) => {
	try {
		// Save the product in MongoDB
		const product = new Product(productData);
		await product.save();

		const productToInsert = product.toObject();
		productToInsert._id = undefined;

		await elasticService.insertDocument(
			"products",
			product._id.toString(),
			productToInsert,
		);

		return product;
	} catch (error) {
		throw new Error(`Error creating product: ${error.message}`);
	}
};

// Update a product in both MongoDB and Elasticsearch
const updateProduct = async (id, productData) => {
	try {
		// Update the product in MongoDB
		const product = await Product.findByIdAndUpdate(id, productData, {
			new: true,
		});

		// Update the product in Elasticsearch
		// Again, ensure you're passing the correct format
		await elasticService.updateDocument("products", id, product.toObject());

		return product;
	} catch (error) {
		throw new Error(`Error updating product: ${error.message}`);
	}
};

const deleteProduct = async (id) => {
	try {
		// Delete the product from MongoDB
		await Product.findByIdAndDelete(id);

		// Delete the product from Elasticsearch
		await elasticService.deleteDocument("products", id);

		return true;
	} catch (error) {
		throw new Error(`Error deleting product: ${error.message}`);
	}
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
