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

    async getProductById(req, res) {
        const id = req.params.id;
        try {
            const product = await productService.getProductById(id);
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async List(req, res) {
        try {
            const product = await productService.List(req.query);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Internal error', error });
        }
    }

    async getProductsByCategory(req, res) {
        const category = req.params.category;
        try {
            const products = await productService.getProductsByCategory({
                category,
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async createProduct(req, res) {
        const data = req.body;
        const files = req.files;
        try {
            const product = await productService.createProduct(data, files);
            res.status(201).json({ success: true, message: product });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async updateProduct(req, res) {
        const id = req.params.id;
        const data = req.body;
        try {
            const product = await productService.updateProduct(id, data);
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.id;
        try {
            const product = await productService.deleteProduct(id);
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}

module.exports = new ProductController();
