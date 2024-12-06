const { getCartData } = require('~v1/helpers/getCartData');
const Coupon = require('~v1/models/Coupon');
const Order = require('~v1/models/Order');
const User = require('~v1/models/Account');
const Product = require('~v1/models/Product');
const Cart = require('~v1/models/Cart');
const Loyalty = require('~v1/models/Loyalty');

const generatePassword = require('~v1/helpers/passwordGenerator');
const hashPassword = require('~v1/helpers/hashPassword');

const sendEmail = require('~v1/services/sendEmail');

const {
    SendPassword_Email_Template,Checkout_Email_Template
} = require('~/public/templates/emailTemplate');

module.exports = {
    async checkout(req, res) {
        try {
            const {
                couponCode,
                pointsRedeemed,
                shippingAddress,
                items,
                email,
                shippingOption,
                total,
            } = req.body;

            if (!email  || !shippingAddress || !items || !shippingOption || !total) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields',
                });
            }

            const isLogin = req.user? true : false;

            let user = await User.findOne({ email: email });

           
            if (!user) {
                const password = generatePassword();
                user = await User.create({
                    username: shippingAddress.name,
                    email: email,
                    password: hashPassword(password),
                    phone: shippingAddress.phone,
                    addresses: [
                        {
                            street: shippingAddress.street,
                            city: shippingAddress.city,
                        },
                    ],
                });

                const emailTemplate = SendPassword_Email_Template.replace(
                    '{verificationCode}',
                    password,
                ).replace('{email}', user.email);
                await sendEmail(
                    user.email,
                    'Your Account Details',
                    emailTemplate,
                );

            }
            
            const userId = user._id;

            if(couponCode && isLogin){
                var coupon = await Coupon.findOne({ code: couponCode, quantity: { $gt: 0 },  usedBy: { $ne: userId } });
                if (!coupon) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid coupon code',
                    });
                }
            }
            

            const orderData = {
                userId,
                items,
                shippingAddress,
                shippingOption,
                totalAmount: total,
                coupon: coupon ? coupon._id : null,
            };
            const order = await Order.create(orderData);

            if (req.user) {
                await Cart.deleteOne({ userId });
            } else {
                res.clearCookie('cart');
            }

            for (const item of items) {
                await Product.findOneAndUpdate(
                    {productId: item.productId},
                    { 
                        $inc: { 
                            stock: -item.quantity, // Decrease stock
                            sold: item.quantity    // Increase sold
                        } 
                    },
                    { new: true }
                );
            }

            if(pointsRedeemed && isLogin){
                const loyalty = await Loyalty.findOne({ userId });
                loyalty.pointsRedeemed += pointsRedeemed;
                loyalty.pointsEarned -= pointsRedeemed;
                await loyalty.save();
            }
           

            if (coupon) {
                coupon.quantity -= 1;
                await coupon.save();
            }

            const emailTemplate = Checkout_Email_Template.replace(
                '{name}',
                user.username,
            ).replace('{email}', user.email);
            
            await sendEmail(
                user.email,
                'Your Account Details',
                emailTemplate,
            );



            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                order,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async cancelOrder(req, res) {
        try {
            const { orderId } = req.params;

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(400).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            if (order.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Order cannot be cancelled',
                });
            }

            const {items, coupon, pointsRedeemed} = order;

            for (const item of items) {
                const product = await Product.findOne({ productId: item.productId });
                if (!product) {
                    continue;
                }


                product.stock += item.quantity;
                product.sold -= item.quantity;

                await product.save();
            }

            if (coupon) {
                const coupon = await Coupon.findById(order.coupon);
                coupon.quantity += 1;
                coupon.usedBy = coupon.usedBy.filter((id) => id.toString() !== order.userId.toString());

                await coupon.save();
            }

            if(pointsRedeemed) {

                const loyalty = await Loyalty.findOne({ userId });
                loyalty.pointsRedeemed -= pointsRedeemed;
                loyalty.pointsEarned += pointsRedeemed;
                await loyalty.save();
            }


            order.status = 'cancelled';

            await order.save();

            res.json({
                success: true,
                message: 'Order cancelled successfully',
            });

        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(400).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            if (order.status === 'cancelled') {
                return res.status(400).json({
                    success: false,
                    message: 'Order is already cancelled',
                });
            }

            if (order.status === 'delivered') {
                return res.status(400).json({
                    success: false,
                    message: 'Order is already delivered',
                });
            }


            if(status === 'delivered'){
                const userId = order.userId.toString();

                const loyalty = await Loyalty.findOne({ userId });

                if (!loyalty) {
                    await Loyalty.create({
                        userId,
                        pointsEarned: Math.floor(order.totalAmount / 100),
                        pointsRedeemed: 0,
                    });
                } else {
                    loyalty.pointsEarned += Math.floor(order.totalAmount / 100);
                    await loyalty.save();
                }
            }


            order.status = status;
            await order.save();

            res.json({
                success: true,
                message: 'Order status updated successfully',
            });

        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
