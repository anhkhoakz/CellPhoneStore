const Cart = require("~v1/models/Cart");
const Product = require("~v1/models/Product");

async function getCartData(req) {
	if (req.user) {
		// For logged-in users: retrieve cart from the database
		let cart = await Cart.findOne({ userId: req.user.userId });

		// If no cart exists, create an empty one
		if (!cart) {
			cart = new Cart({ userId: req.user.userId, items: [] });
			await cart.save();
		}

		const cartItems = cart.items || [];

		const productIds = cartItems.map((item) => item.productId);
		const products = await Product.find({ productId: { $in: productIds } });

		// Attach product details to each item in the guest cart
		const itemsWithDetails = cartItems.map((item) => {
			const product = products.find((p) => p.productId === item.productId);

			return {
				productId: product?.productId,
				productDetails: product,
				quantity: item.quantity,
				variantId: item.variantId,
			};
		});

		console.log("db");

		return { items: itemsWithDetails };
	}
	// For guest users: retrieve cart data from cookie
	const cookieCart = req.cookies.cart;

	if (!cookieCart) {
		return { items: [] }; // Return an empty cart if no cookie data is found
	}

	const cartItems = JSON.parse(cookieCart).items || [];

	// Fetch product details from the database for guest cart items
	const productIds = cartItems.map((item) => item.productId);
	const products = await Product.find({ productId: { $in: productIds } });

	// Attach product details to each item in the guest cart
	const itemsWithDetails = cartItems.map((item) => {
		const product = products.find((p) => p.productId === item.productId);

		return {
			productId: product?.productId,
			productDetails: product,
			quantity: item.quantity,
			variantId: item.variantId,
		};
	});

	console.log("cookie");

	return { items: itemsWithDetails };
}

module.exports = { getCartData };
