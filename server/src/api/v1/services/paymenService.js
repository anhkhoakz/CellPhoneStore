module.exports = {
    processPayment(cart, paymentData) {
        // Process payment here
        // For simplicity, we'll just return a successful payment
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    paymentId: 'payment-id-123',
                });
            }, 2000);
        });
    },
};
