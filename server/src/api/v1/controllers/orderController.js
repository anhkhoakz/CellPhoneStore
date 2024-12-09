const Order = require("~v1/models/Order");
const Product = require("~v1/models/Product");

module.exports = {
    async trackOrder(req, res) {
        try {
            const order = await Order.findById(req.params.orderId).select(
                "status"
            );
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

    async getMyOrder(req, res) {
        try {
            const { userId } = req.user;
            const { orderId } = req.params;

            const order = await Order.findOne({ userId, _id: orderId });

            if (!order)
                return res
                    .status(404)
                    .json({ success: false, message: "Order not found" });

            res.status(200).json({ success: true, message: order });
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
            { new: true }
        );
        if (order) {
            const emailTemplate = `Order confirmed! Your order number is ${order.orderNumber}. Total: $${order.totalAmount}`;
            await sendEmail(
                order.userId.email,
                "Order Confirmation",
                emailTemplate
            );
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
                    (item) => item.productId === rating.productId
                );

                if (!item) {
                    return res.status(404).json({
                        success: false,
                        message: `Product ${rating.productId} not found in order`,
                    });
                }

                const product = await Product.findOne({
                    productId: item.productId,
                });
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: `Product ${item.productId} not found in database`,
                    });
                }

                // const existingRating = product.ratings.find(
                //     (r) => r.userId.toString() === userId.toString()
                // );

                // if (existingRating) {
                //     return res.status(400).json({
                //         success: false,
                //         message: `You have already rated product ${item.productId}`,
                //     });
                // }

                // Add new rating and comment
                const { star, review } = rating;

				let starIcon;
                if (star == 5) starIcon = "⭐⭐⭐⭐⭐";
                else if (star == 4.5) starIcon = "⭐⭐⭐⭐½";
                else if (star == 4) starIcon = "⭐⭐⭐⭐";
                else if (star == 3.5) starIcon = "⭐⭐⭐½";
                else if (star == 3) starIcon = "⭐⭐⭐";
                else if (star == 2.5) starIcon = "⭐⭐½";
                else if (star == 2) starIcon = "⭐⭐";
                else if (star == 1.5) starIcon = "⭐½";
                else if (star == 1) starIcon = "⭐";

                const comment = review ? `${starIcon} - ${review}` : `${starIcon}`;

				console.log("Rating:", star);

                product.ratings.push({ userId, rating: star });
                product.comments.push({ username, comment });
				

				console.log("Product:", product);

                await product.save();
            }

			console.log("Order:", order);

            await order.save();

            res.status(200).json({ success: true, message: "Order rated" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getTopBestSellersFromDelivered(req, res) {
        try {
          // Calculate the date range for the last 30 days
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
      
          // Aggregation pipeline
          const topProducts = await Order.aggregate([
            { 
              $match: { 
                status: "delivered", // Filter only delivered orders
                createdAt: { $gte: startDate, $lte: endDate }, // Filter orders in the last 30 days
              } 
            },
            { $unwind: "$items" }, // Deconstruct the `items` array
            {
              $group: {
                _id: "$items.productId", // Group by productId
                totalSold: { $sum: "$items.quantity" }, // Sum up quantities sold
              },
            },
            { $sort: { totalSold: -1 } }, // Sort by totalSold in descending order
            { $limit: 8 }, // Limit to top 8 products
            {
              $lookup: {
                from: "products", // Assuming your products collection is named "products"
                localField: "_id",
                foreignField: "productId",
                as: "productDetails",
              },
            },
            { $unwind: "$productDetails" }, // Deconstruct the `productDetails` array
            {
              $project: {
                productId: "$_id",
                totalSold: 1,
                productDetails: {
                  name: 1,
                  price: 1,
                  image: 1,
                  description: 1,
                  ratings: 1,
                },
              },
            },
          ]);
      
          // Send the response
          res.status(200).json({
            success: true,
            message: "Top 8 best-selling products in the last 30 days",
            data: topProducts,
          });
        } catch (error) {
          console.error("Error fetching top products:", error);
          res.status(500).json({
            success: false,
            message: "An error occurred while fetching top products",
            error: error.message,
          });
        }
      },
};
