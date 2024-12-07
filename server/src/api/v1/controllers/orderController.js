const Order = require("~v1/models/Order");
const Product = require("~v1/models/Product");

module.exports = {
	async trackOrder(req, res) {
		try {
			const order = await Order.findById(req.params.orderId).select("status");
			if (!order)
				return res
					.status(404)
					.json({ success: false, message: "Order not found" });
			res.status(200).json({ success: true, status: order.status });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},

	async getMyOrders(req, res) {
		try {
			const userId = req.user.userId;
			const orders = await Order.find({ userId }).sort({ createdAt: -1 });

			if (!orders)
				return res
					.status(404)
					.json({ success: false, message: "No orders found" });

			res.status(200).json({ success: true, message: orders });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},

	async getOrders(req, res) {
		try {
			const orders = await Order.find().sort({ createdAt: -1 });

			if (!orders)
				return res
					.status(404)
					.json({ success: false, message: "No orders found" });

			res.status(200).json({ success: true, message: orders });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},

	async confirmPayment(orderId) {
		const order = await Order.findByIdAndUpdate(
			orderId,
			{ paymentConfirmed: true },
			{ new: true },
		);
		if (order) {
			const emailTemplate = `Order confirmed! Your order number is ${order.orderNumber}. Total: $${order.totalAmount}`;
			await sendEmail(order.userId.email, "Order Confirmation", emailTemplate);
		}
	},

	async ratingOrder(req, res) {
		try {
			const { userId, username } = req.user;

			const { orderId } = req.params;
			const { ratings } = req.body;

			const order = await Order.findById(orderId);
			if (!order)
				return res
					.status(404)
					.json({ success: false, message: "Order not found" });

			if (order.userId.toString() !== userId.toString())
				return res
					.status(401)
					.json({ success: false, message: "Unauthorized" });

			if (order.isRating)
				return res
					.status(401)
					.json({ success: false, message: "Order already rated" });

			if (order.status !== "delivered")
				return res
					.status(400)
					.json({ success: false, message: "Order not delivered" });

			order.isRating = true;

			for (const rating of ratings) {
				const item = order.items.find(
					(item) => item.productId === rating.productId,
				);

				if (!item) {
					return res.status(404).json({
						success: false,
						message: `Product ${rating.productId} not found in order`,
					});
				}

				const product = await Product.findOne({ productId: item.productId });
				if (!product) {
					return res.status(404).json({
						success: false,
						message: `Product ${item.productId} not found in database`,
					});
				}

				const existingRating = product.ratings.find(
					(r) => r.userId.toString() === userId.toString(),
				);

				if (existingRating) {
					return res.status(400).json({
						success: false,
						message: `You have already rated product ${item.productId}`,
					});
				}

				// Add new rating and comment
				const { star, review } = rating;
				const comment = `${star} - ${review}`;

				product.ratings.push({ userId, star });
				product.comments.push({ username, comment });

				await product.save();
			}

			await order.save();

			res.status(200).json({ success: true, message: "Order rated" });
		} catch (error) {
			res.status(500).json({ success: false, message: error.message });
		}
	},
};
