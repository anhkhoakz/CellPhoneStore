const validator = require("validator");

const checkProductValidation = (req, res, next) => {
	const { name, price, category, stock, variants } = req.body;

	// Ensure that req.files exists before accessing fields like 'image' and 'images'
	const hasMainImage = req.files?.some((file) => file.fieldname === "image");

	// Check if all required fields are provided, including the main image
	const isAllFieldsProvided =
		name && price && category && stock && hasMainImage;

	if (!isAllFieldsProvided) {
		console.log("Missing fields:", {
			name,
			price,
			category,
			stock,
			hasMainImage,
		});
		return res.status(400).json({
			message: "All fields including the main image are required",
		});
	}

	// Validate name (ensure it's not empty and meets length requirements)
	if (!validator.isLength(name, { min: 1, max: 255 })) {
		return res.status(400).json({
			message: "Product name is required and must be less than 255 characters",
		});
	}

	// Validate price (ensure it's a number and greater than zero)
	if (!validator.isDecimal(price.toString()) || price <= 0) {
		return res.status(400).json({
			message: "Price must be a valid number and greater than zero",
		});
	}

	// Validate category (ensure it's a valid value)
	const validCategories = ["phone", "laptop", "tablet", "headphone"];
	if (!validCategories.includes(category)) {
		return res.status(400).json({
			message: `Category must be one of the following: ${validCategories.join(", ")}`,
		});
	}

	// Validate stock (ensure it's a positive integer)
	if (!validator.isInt(stock.toString(), { min: 1 })) {
		return res.status(400).json({
			message: "Stock must be a positive integer",
		});
	}

	// You can also validate the 'variants' field if it's required, e.g.:
	if (variants && !Array.isArray(variants)) {
		return res.status(400).json({
			message: "Variants should be an array",
		});
	}

	// Proceed to the next middleware if validation passes
	next();
};

module.exports = {
	checkProductValidation,
};
