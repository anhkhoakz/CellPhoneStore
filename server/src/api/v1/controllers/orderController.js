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

    async getOrderHistory(req, res) {
        try {
            const orders = await Order.find({ userId: req.user._id }).select(
                'orderNumber date totalAmount status',
            );
            res.status(200).json({ success: true, orders });
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
