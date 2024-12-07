const Cart = require("~v1/models/Cart");
const Product = require("~v1/models/Product");
const { getCartData } = require("~v1/helpers/getCartData");

const Coupon = require("~v1/models/Coupon");

const axios = require("axios");

const fs = require("node:fs");

const getShippingFee = async (data) => {
	try {
		const response = await axios.get(
			"https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
			{
				params: data, // Use 'params' for GET requests
				headers: {
					shop_id: 5353427,
					token: "373af170-9446-11ef-9620-5e559486e6bb",
				},
			},
		);

		return response.data.data.total;
	} catch (error) {
		console.error("Error:", error);
	}
};

module.exports = {
	async getCart(req, res, next) {
		try {
			const cartData = await getCartData(req);
			res.status(200).json(cartData);
		} catch (err) {
			next(err);
		}
	},

	async addToCart(req, res) {
		const { productId, quantity, variantId } = req.body;

		const product = await Product.findOne({ productId });
		if (!product) {
			return res.status(400).json({
				success: false,
				message: "Product not found",
			});
		}

		if (product.variants.length > 0) {
			const variant = product.variants.find(
				(v) => v._id.toString() === variantId,
			);
			if (!variant) {
				return res.status(400).json({
					success: false,
					message: "Variant not found",
				});
			}
		}

		// check if product is in stock
		if (product.stock < quantity) {
			return res.status(400).json({
				success: false,
				message: "Product out of stock",
			});
		}

		let cart;

		if (req.user) {
			cart =
				(await Cart.findOne({ userId: req.user.userId })) ||
				new Cart({ userId: req.user.userId });
			const existingItem = cart.items.find(
				(item) =>
					item.productId === productId &&
					item.variantId?.toString() === variantId,
			);

			if (existingItem) {
				if (product.stock < existingItem.quantity + quantity) {
					return res.status(400).json({
						success: false,
						message: "Product out of stock",
					});
				}
				existingItem.quantity += quantity;
			} else {
				cart.items.push({ productId, quantity, variantId });
			}

			cart.userId = req.user.userId;
			await cart.save();
			console.log("Cart saved db");
		} else {
			cart = JSON.parse(req.cookies.cart || "{}");
			const itemIndex = cart.items?.findIndex(
				(item) => item.productId === productId && item.variantId === variantId,
			);

			if (itemIndex >= 0) {
				if (product.stock < cart.items[itemIndex].quantity + quantity) {
					return res.status(400).json({
						success: false,
						message: "Product out of stock",
					});
				}
				cart.items[itemIndex].quantity += quantity;
			} else {
				cart.items = [
					...(cart.items || []),
					{ productId, quantity, variantId },
				];
			}
			console.log("Setting cookie with cart:", JSON.stringify(cart));
			res.cookie("cart", JSON.stringify(cart), {
				httpOnly: false,
				sameSite: "lax",
				secure: false,
				// maxAge: 365 * 24 * 60 * 60 * 1000,
			});

			console.log("Cart saved cookie");
		}

		res.status(200).json({ success: true, cart });
	},

	async updateQuantity(req, res) {
		try {
			const { productId, quantity, variantId } = req.body;

			if (!productId || !quantity) {
				return res.status(400).json({
					success: false,
					message: "Product ID and quantity are required",
				});
			}

			const product = await Product.findOne({ productId });
			if (!product) {
				return res.status(400).json({
					success: false,
					message: "Product not found",
				});
			}

			if (product.variants.length > 0) {
				const variant = product.variants.find(
					(v) => v._id.toString() === variantId,
				);
				if (!variant) {
					return res.status(400).json({
						success: false,
						message: "Variant not found",
					});
				}
			}

			let updatedCart;

			if (req.user) {
				const cart = await Cart.findOne({ userId: req.user.userId });
				if (!cart) {
					return res
						.status(404)
						.json({ success: false, message: "Cart not found" });
				}

				const item = cart.items.find((item) => {
					// Check if variantId exists, and if so, match both productId and variantId
					if (item.variantId) {
						return (
							item.productId === productId &&
							item.variantId?.toString() === variantId
						);
					}
					// If variantId doesn't exist, match only productId
					return item.productId === productId;
				});

				if (!item) {
					return res
						.status(404)
						.json({ success: false, message: "Item not found in cart" });
				}

				if (product.stock < quantity) {
					return res.status(400).json({
						success: false,
						message: "Product out of stock",
					});
				}

				item.quantity = quantity;
				updatedCart = await cart.save();
			} else {
				const cookieCart = req.cookies.cart
					? JSON.parse(req.cookies.cart)
					: { items: [] };

				const item = cookieCart.items.find((item) => {
					if (item.variantId) {
						return item.productId === productId && item.variantId === variantId;
					}
					return item.productId === productId;
				});

				if (!item) {
					return res
						.status(404)
						.json({ success: false, message: "Item not found in cart" });
				}

				if (product.stock < quantity) {
					return res.status(400).json({
						success: false,
						message: "Product out of stock",
					});
				}

				item.quantity = quantity;

				res.cookie("cart", JSON.stringify(cookieCart), {
					httpOnly: false,
					sameSite: "lax",
					secure: false,

					// maxAge: 365 * 24 * 60 * 60 * 1000,
				});

				updatedCart = cookieCart;
			}

			return res.status(200).json({ success: true, cart: updatedCart });
		} catch (error) {
			console.error("Error updating quantity:", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" });
		}
	},

	async removeFromCart(req, res) {
		try {
			const { productId, variantId } = req.body;

			if (!productId) {
				return res
					.status(400)
					.json({ success: false, message: "Product ID is required." });
			}

			let updatedCart;

			if (req.user) {
				// Handle logged-in user case
				const cart = await Cart.findOne({ userId: req.user.userId });
				if (!cart) {
					return res
						.status(404)
						.json({ success: false, message: "Cart not found." });
				}

				const itemIndex = cart.items.findIndex((item) => {
					if (item.variantId) {
						return (
							item.productId === productId &&
							item.variantId?.toString() === variantId
						);
					}
					return item.productId === productId;
				});

				const item = cart.items.find((item) => {
					// Check if variantId exists, and if so, match both productId and variantId
					if (variantId) {
						return (
							item.productId === productId &&
							item.variantId?.toString() === variantId
						);
					}
					// If variantId doesn't exist, match only productId
					return item.productId === productId;
				});

				if (itemIndex >= 0) {
					cart.items.splice(itemIndex, 1);
					updatedCart = await cart.save();
				} else {
					return res
						.status(404)
						.json({ success: false, message: "Item not found in cart." });
				}
			} else {
				// Handle cookie-based cart for guest users
				const cookieCart = req.cookies.cart
					? JSON.parse(req.cookies.cart)
					: { items: [] };

				console.log(req.body);
				const itemIndex = cookieCart.items.findIndex((item) => {
					if (item.variantId) {
						return item.productId === productId && item.variantId === variantId;
					}

					return item.productId === productId;
				});

				if (itemIndex >= 0) {
					cookieCart.items.splice(itemIndex, 1);

					res.cookie("cart", JSON.stringify(cookieCart), {
						httpOnly: false,
						sameSite: "lax",
						secure: false,
						// maxAge: 365 * 24 * 60 * 60 * 1000,
					});

					updatedCart = cookieCart;
				} else {
					return res
						.status(404)
						.json({ success: false, message: "Item not found in cart." });
				}
			}

			return res.status(200).json({ success: true, cart: updatedCart });
		} catch (error) {
			console.error("Error removing item from cart:", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error." });
		}
	},

	async checkCoupon(req, res) {
		const { couponCode } = req.body;
		const coupon = await Coupon.findOne({
			code: couponCode,
			isUsed: false,
		});

		if (!coupon) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired coupon",
			});
		}

		res.status(200).json({
			success: true,
			coupon: {
				code: coupon.code,
				discount: coupon.discount,
				type: coupon.type,
			},
		});
	},

	async getShippingFee(req, res) {
		const { shippingAddress } = req.body;
		const districtData = await fs.promises.readFile(
			"src/api/v1/controllers/city_district.json",
			"utf8",
		);
		const districts = JSON.parse(districtData);
		const province = districts.find(
			(item) =>
				item.ProvinceName.toLowerCase() === shippingAddress.city.toLowerCase(),
		);

		let districtId = null;
		if (province) {
			const district = province.Districts.find(
				(d) =>
					d.DistrictName.toLowerCase() ===
					shippingAddress.district.toLowerCase(),
			);
			if (district) districtId = district.DistrictID;
		}

		if (!districtId) {
			return res.status(400).json({
				success: false,
				message: "Invalid address",
			});
		}

		const data = {
			service_type_id: 2,
			to_district_id: districtId,
			weight: 1000,
		};

		const vndToUsdRate = 23000;
		const standardVnd = await getShippingFee(data);
		const standard = standardVnd / vndToUsdRate;

		const express = standard * 1.5;

		res.status(200).json({
			success: true,
			shippingFee: { standard, express },
		});
	},

	async getTotal(req, res) {
		const { shippingFee = 0, coupon } = req.body;

		const cartData = await getCartData(req);

		if (cartData.items?.length > 0) {
			const productIds = cartData.items.map((item) => item.productId);
			const products = await Product.find({ _id: { $in: productIds } });

			let subtotal = 0;
			const items = cartData.items.map((item) => {
				const product = products.find(
					(p) => p._id.toString() === item.productId,
				);
				const itemTotal = product.price * item.quantity;
				subtotal += itemTotal;

				return { product, quantity: item.quantity, total: itemTotal };
			});

			if (coupon) {
				if (coupon.type === "percent") {
					discount = (coupon.discount / 100) * subtotal;
				} else {
					discount = coupon.discount;
				}
			}

			const tax = subtotal * 0.1;
			const total = subtotal + tax + shippingFee - discount;

			res.status(200).json({ total });
		} else {
			res.status(200).json({
				subtotal: 0,
			});
		}
	},
};
