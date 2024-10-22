const Product = require('~v1/models/Product');
const productService = require('~v1/services/ProductService');

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await productService.getProducts();
            res.json(products);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new ProductController();
