const validator = require('validator');

const checkProuductValidation = (req, res, next) => {
    const { name, price, category, stock } = req.body;

    // Check if the main image exists in req.files (which is an array)

    console.log(req.files);
    const hasMainImage =
        req.files && req.files.some((file) => file.fieldname === 'image');

    if (!name || !price || !category || !stock || !hasMainImage) {

        console.log(name, price, category, stock, hasMainImage);
        return res.status(400).json({
            message: 'All fields including the main image are required',
        });
    }

    // Name validation
    if (!validator.isLength(name, { min: 1, max: 255 })) {
        return res
            .status(400)
            .json({ message: 'Name must be between 5 and 255 characters' });
    }

    // Category validation
    if (!validator.isLength(category, { min: 1, max: 255 })) {
        return res
            .status(400)
            .json({ message: 'Category must be between 5 and 255 characters' });
    }

    // Price validation (must be a number)
    if (!validator.isNumeric(price)) {
        return res.status(400).json({ message: 'Price must be a number' });
    }

    // Stock validation (must be a number)
    if (!validator.isNumeric(stock)) {
        return res.status(400).json({ message: 'Stock must be a number' });
    }

    next();
};

module.exports = { checkProuductValidation };
