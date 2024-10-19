const Product = require('~v1/models/Product');

// /**
//  * @implements {ProductServiceInterface}
//  */

class ProductService {
    async getProducts() {
        return await Product.find({});
    }

    async getProductById(id) {
        return await Product.findById(id).populate('category', 'name');
    }

    async createProduct(data) {
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
