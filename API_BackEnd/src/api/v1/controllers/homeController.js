<<<<<<< HEAD
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
=======
const Product = require('~/apis/v1/models/Product');

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
>>>>>>> 4469d3e85fcb1b7ad9ebb430f8d7d39720dbe161
