const Order = require('~v1/models/Order');

module.exports = {
    async trackOrder(req, res) {
        try {
            const order = await Order.findById(req.params.orderId).select(
                'status',
            );
            if (!order)
                return res
                    .status(404)
                    .json({ success: false, message: 'Order not found' });
            res.status(200).json({ success: true, status: order.status });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getOrders(req, res) {
        try {
            const userId = req.user.userId;
            const orders = await Order.find({ userId }).sort({ createdAt: -1 });

            if (!orders)
                return res
                    .status(404)
                    .json({ success: false, message: 'No orders found' });

            res.status(200).json({success: true, message: orders});
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
            await sendEmail(
                order.userId.email,
                'Order Confirmation',
                emailTemplate,
            );
        }
    },
};
