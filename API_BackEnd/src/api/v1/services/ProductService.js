const Product = require('~v1/models/Product');

// /**
//  * @implements {ProductServiceInterface}
//  */

class ProductService {
    async getProducts() {
        return await Product.find({});
    }

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
        return await Product.create(data);
    }

    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductService();
