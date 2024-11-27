const Product = require('~v1/models/Product');

// /**
//  * @implements {ProductServiceInterface}
//  */

class ProductService {
    async getProductsByCategory({ category }) {
        try {
            const products = await Product.find({ category });
            if (products.length === 0) {
                return res
                    .status(404)
                    .json({ message: 'No products found in this category.' });
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
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
        return await Product.findById(id).populate('category', 'name');
    }

    async createProduct(data, files) {
        const product = await Product.findOne({ name: data.name });
        if (product) {
            return { code: 401, message: 'Product already exists' };
        }

        let mainImage,
            variantImages = [];

        files.forEach((file) => {
            if (file.fieldname === 'image') {
                mainImage = file.filename;
            } else {
                variantImages.push(file.filename);
            }
        });

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
        return { code: 201, message: 'Product created successfully', product: result };
    }

    async updateProduct(id, data, files) {
        const product = await Product.findOne({ name: data.name });

        if (!product) {
            return { code: 404, message: 'Product not found' };
        }

        if (data.name && product.name === data.name) {
            return { code: 401, message: 'Product already exists' };
        }

        let mainImage,
            variantImages = [];

        // Check if there are any files to process
        if (files) {
            files.forEach((file) => {
                if (file.fieldname === 'image') {
                    mainImage = file.filename;
                } else {
                    variantImages.push(file.filename);
                }
            });
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

        await Product.findByIdAndUpdate(id, data, { new: true });

        return { code: 200, message: 'Product updated successfully' };
    }

    async deleteProduct(id) {
        const product = await Product.findOne({ _id: id });

        if (!product) {
            return { code: 404, message: 'Product not found' };
        }
        await Product.findByIdAndDelete(id);

        return { code: 200, message: 'Product deleted successfully' };
    }

    async searchProducts({
        q,
        sort,
        category,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
    }) {
        const query = {};

        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } }, // Case-insensitive search on name
                { description: { $regex: q, $options: 'i' } }, // Case-insensitive search on description
                { category: { $regex: q, $options: 'i' } }, // Case-insensitive search on category
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                query.price.$lte = parseFloat(maxPrice);
            }
        }

        if (minRating || maxRating) {
            query.rating = {};
            if (minRating) query.rating.$gte = parseFloat(minRating); // Minimum rating
            if (maxRating) query.rating.$lte = parseFloat(maxRating); // Maximum rating
        }

        const sortOptions = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating_asc: { rating: 1 },
            rating_desc: { rating: -1 },
        }[sort] || { _id: -1 };

        return await Product.find(query).sort(sortOptions);
    }
}

module.exports = new ProductService();
