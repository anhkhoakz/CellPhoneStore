const Cart = require('~v1/models/Cart');
const Product = require('~v1/models/Product');

async function getCartData(req) {
    if (req.user) {
        // For logged-in users: retrieve cart from the database
        let cart = await Cart.findOne({ userId: req.user._id }).populate(
            'items.productId',
        );

        // If no cart exists, create an empty one
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }
        return cart;
    } else {
        // For guest users: retrieve cart data from cookie
        const cookieCart = req.cookies.cart;

        if (!cookieCart) {
            return { items: [] }; // Return an empty cart if no cookie data is found
        }

        const cartItems = JSON.parse(cookieCart).items || [];

        // Fetch product details from the database for guest cart items
        const productIds = cartItems.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        // Attach product details to each item in the guest cart
        const itemsWithDetails = cartItems.map((item) => {
            const product = products.find(
                (p) => p._id.toString() === item.productId,
            );
            return {
                productId: product?._id,
                productDetails: product,
                quantity: item.quantity,
                variantId: item.variantId,
            };
        });

        return { items: itemsWithDetails };
    }
}

module.exports = { getCartData };
