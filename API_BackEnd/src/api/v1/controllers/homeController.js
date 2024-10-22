const Product = require('~v1/models/Product');

class HomeController {
    async getHomePage(req, res) {
        try {
            const products = await Product.find({});
            res.json(products);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new HomeController();
