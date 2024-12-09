const Product = require("~v1/models/Product");
const client = require("~/config/elasticsearch");

// /**
//  * @implements {ProductServiceInterface}
//  */

class ProductService {
	async getProductsByCategory({ category }) {
		try {
			const products = await Product.find({ category });
			if (products.length === 0) {
				return { code: 404, message: "No products found", success: false };			
			}


			return { code: 200, message: products, success: true };
		} catch (error) {
			res.status(500).json({ message: "error", error, success: false });
		}
	}

	async getAllProducts() {
		try {
			const products = await Product.find({});
			if (products.length === 0) {
				return { code: 404, message: "No products found" };
			}

			return {code: 200, message: products };
		} catch (error) {
			res.status(500).json({ message: "Server error", error });
		}
	}

	// pagination step freedom
	// async List({ page, pagesize = 12 }) {
	//     const query = Product.find({});
	//     /*
	//         page    skip    limit
	//         1       0       12
	//         2       12      12
	//         3       24      12

	//         skip = (page - 1) * limit
	//     */
	//     if (page && pagesize) {
	//         const skip = (page - 1) * pagesize;
	//         query.skip(skip).limit(pagesize);
	//     }

	//     return await query;
	// }

	// pagination step by step

	async List({ after, limit = 12 }) {
		const query = after ? { _id: { $gt: after } } : {};
		const products = await Product.find(query).limit(limit);

		return products;
	}

	async getProductById(id) {
		try {
			const product = await Product.findOne({ productId: id });
			if (!product) {
				return { code: 404, message: "Product not found" };
			}

			return { code: 200, message: product };
		} catch (error) {
			return { code: 500, message: "Server error", error };
		}
	}

	async createProduct(data, files) {
		const product = await Product.findOne({ name: data.name });
		if (product) {
			return { code: 401, message: "Product already exists" };
		}

		let mainImage;
		const variantImages = [];

		for (const file of files) {
			if (file.fieldname === "image") {
				mainImage = file.filename;
			} else {
				variantImages.push(file.filename);
			}
		}

		data.image = mainImage;
		if (data.variants && Array.isArray(data.variants)) {
			data.variants = data.variants.map((variant, index) => {
				return {
					...variant,
					image: variantImages[index],
				};
			});
		}

		const result = await Product.create(data);
		await this.addProductToIndex(result);

		return {
			code: 201,
			message: "Product created successfully",
			product: result,
		};
	}

	async addProductToIndex(product) {
		try {
			await client.index({
				index: "products",
				id: product._id.toString(),
				document: {
					name: product.name,
					description: product.description,
					category: product.category,
					price: product.price,
					stock: product.stock,
					sold: product.sold,
					variants: product.variants,
					image: product.image,
					ratings: product.ratings.map((rating) => ({
						userId: rating.userId,
						rating: rating.rating,
					})),
					comments: product.comments.map((comment) => ({
						username: comment.username,
						comment: comment.comment,
						createAt: comment.createAt,
					})),
					createAt: product.createAt,
					updateAt: product.updateAt,
				},
			});
			console.log("Product indexed in Elasticsearch");
		} catch (error) {
			console.error("Error indexing product:", error);
		}
	}

	async updateProduct(id, data, files) {
		const product = await Product.findOne({ productId: id });

		if (!product) {
			return { code: 404, message: "Product not found" };
		}

		const existing = await Product.findOne({
			name: data.name,
			productId: { $ne: id },
		});

		if (existing) {
			return { code: 401, message: "Product already exists" };
		}

		let mainImage;
		const variantImages = [];

		// Check if there are any files to process
		if (files) {
			for (const file of files) {
				if (file.fieldname === "image") {
					mainImage = file.filename;
				} else {
					variantImages.push(file.filename);
				}
			}
		}

		if (mainImage) {
			data.image = mainImage;
		}

		if (data.variants && Array.isArray(data.variants)) {
			data.variants = data.variants.map((variant, index) => {
				return {
					...variant,
					image: variantImages[index] || variant.image, // Keep existing image if none is provided
				};
			});
		}

		const updatedProduct = await Product.findByIdAndUpdate(product._id, data, {
			new: true,
			runValidators: true,
		});

		// await client.update({
		// 	index: "products",
		// 	id: product._id.toString(),
		// 	doc: {
		// 		...data,
		// 		updateAt: new Date(),
		// 	},
		// });

		if (!updatedProduct) {
			return { code: 500, message: "Failed to update product" };
		}

		return { code: 200, message: "Product updated successfully" };
	}

	async deleteProduct(id) {
		const product = await Product.findOne({ _id: id });

		if (!product) {
			return { code: 404, message: "Product not found" };
		}
		await Product.findByIdAndDelete(id);

		await client.delete({
			index: "products",
			id: product._id.toString(),
		});

		return { code: 200, message: "Product deleted successfully" };
	}

	// async searchProducts({
	// 	q,
	// 	sort,
	// 	category,
	// 	minPrice,
	// 	maxPrice,
	// 	minRating,
	// 	maxRating,
	// }) {
	// 	const query = {};

	// 	if (q) {
	// 		query.$or = [
	// 			{ name: { $regex: q, $options: "i" } }, // Case-insensitive search on name
	// 			{ description: { $regex: q, $options: "i" } }, // Case-insensitive search on description
	// 			{ category: { $regex: q, $options: "i" } }, // Case-insensitive search on category
	// 		];
	// 	}

	// 	if (category) {
	// 		query.category = category;
	// 	}

	// 	if (minPrice || maxPrice) {
	// 		query.price = {};
	// 		if (minPrice) {
	// 			query.price.$gte = Number.parseFloat(minPrice);
	// 		}
	// 		if (maxPrice) {
	// 			query.price.$lte = Number.parseFloat(maxPrice);
	// 		}
	// 	}

	// 	if (minRating || maxRating) {
	// 		query.rating = {};
	// 		if (minRating) query.rating.$gte = Number.parseFloat(minRating); // Minimum rating
	// 		if (maxRating) query.rating.$lte = Number.parseFloat(maxRating); // Maximum rating
	// 	}

	// 	const sortOptions = {
	// 		price_asc: { price: 1 },
	// 		price_desc: { price: -1 },
	// 		rating_asc: { rating: 1 },
	// 		rating_desc: { rating: -1 },
	// 	}[sort] || { _id: -1 };

	// 	return await Product.find(query).sort(sortOptions);
	// }

	// async addRating({ productId, rating, user }) {

	//     try {
	//         const product = await Product.findOne({ productId });

	//         if (!product) {
	//             return { code: 404, message: 'Product not found' };
	//         }

	//         const existingRating = product.ratings.find(
	//             (r) => r.user.toString() === user.userId.toString(),
	//         );

	//         if (existingRating) {
	//             return { code: 401, message: 'Rating already exists' };
	//         }

	//         product.ratings.push({ user: user.userId, rating });
	//         product.save();

	//         return { code: 200, message: 'Rating added successfully' };
	//     } catch (error) {
	//         return { code: 500, message: 'Server error', error };
	//     }
	// }

	async getNewProducts() {
		try {

			const products = await Product.find({}).sort({ createAt: -1 }).limit(8);
			
			if (products.length === 0) {
				return { code: 404, message: "No products found", success: false };
			}

			return { code: 200, message: products, success: true };
		} catch (error) {
			return { code: 500, message: "Server error", error, success: false };
		}
	}


	async searchProducts(query) {
		try {
			const response = await client.search({
				index: "products",
				query: {
					bool: {
						must: [
							{
								multi_match: {
									query: query.q,
									fields: ["name", "description", "category"],
								},
							},
						],
						filter: [
							query.category ? { term: { category: query.category } } : null,
							query.minPrice
								? { range: { price: { gte: query.minPrice } } }
								: null,
							query.maxPrice
								? { range: { price: { lte: query.maxPrice } } }
								: null,
						].filter(Boolean),
					},
				},
				sort: query.sort
					? [{ price: query.sort === "price_asc" ? "asc" : "desc" }]
					: undefined,
			});

			const hits = response.hits.hits.map((hit) => ({
				id: hit._id,
				...hit._source,
			}));

			return { status: 200, data: hits };
		} catch (error) {
			console.error("Error searching products:", error);
			return { status: 500, message: "Error performing search", error };
		}
	}

	async getRatingScore(productId) {
		try {
			const product = await Product.findOne({ productId });

			if (!product) {
				return { code: 404, message: "Product not found" };
			}

			const totalRatings = product.ratings.length;

			if (totalRatings === 0) {
				return { code: 200, message: "No ratings yet" };
			}

			const totalScore = product.ratings.reduce(
				(acc, rating) => acc + rating.rating,
				0,
			);

			console.log("Total score:", totalScore);
			const averageRating = totalScore / totalRatings;


			return { code: 200, message: {score: averageRating, reviews: totalRatings } };
		} catch (error) {
			return { code: 500, message: "Server error", error };
		}
	}

	async getComments(productId) {
		try {
			const product = await Product.findOne({ productId });

			if (!product) {
				return { code: 404, message: "Product not found" };
			}

			return { code: 200, message: product.comments };
		} catch (error) {
			return { code: 500, message: "Server error", error };
		}
	}

	async addComment({ productId, comment, username }) {
		try {
			console.log(productId, comment, username);
			const product = await Product.findOne({ productId });

			if (!product) {
				return { code: 404, message: "Product not found" };
			}

			product.comments.push({ comment, username });

			const createAt = Date.now();

			product.save();

			return {
				code: 200,
				message: "Comment added successfully",
				newcomment: { username, comment, createAt },
			};
		} catch (error) {
			return { code: 500, message: "Server error", error };
		}
	}
}

module.exports = new ProductService();
