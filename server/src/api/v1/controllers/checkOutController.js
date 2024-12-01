const { getCartData } = require('~v1/helpers/getCartData');
const Coupon = require('~v1/models/Coupon');
const Order = require('~v1/models/Order');
const User = require('~v1/models/Account');

const generatePassword = require('~v1/helpers/passwordGenerator');
const hashPassword = require('~v1/helpers/hashPassword');

const {
    SendPassword_Email_Template,
} = require('~/public/templates/emailTemplate');

module.exports = {
    async checkout(req, res) {
        try {
            const {
                couponCode,
                shippingAddress,
                items,
                email,
                phone,
                name,
                shippingOption,
                total,
            } = req.body;

            let userId = req.user ? req.user._id : null;
            if (!req.user) {
                if (!email || !name || !phone || !shippingAddress) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please provide all required fields',
                    });
                }

                let user = await User.findOne({ email: email });
                if (!user) {
                    const password = generatePassword();
                    user = await User.create({
                        username: name,
                        email: email,
                        password: hashPassword(password),
                        phone: phone,
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
                userId = user._id;
            }

            const orderData = {
                userId,
                items,
                shippingAddress,
                shippingOption,
                totalAmount: total,
                paymentConfirmed: false,
            };
            const order = await Order.create(orderData);

            if (req.user) {
                await Cart.deleteOne({ userId: req.user._id });
            } else {
                res.clearCookie('cart');
            }

            for (const item of items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } },
                    { new: true },
                );
            }

            if (couponCode) {
                const coupon = await Coupon.findOne({
                    code: couponCode,
                    isUsed: false,
                });

                if (coupon) {
                    coupon.isUsed = true;
                    await coupon.save();
                }
            }

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                order,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};
