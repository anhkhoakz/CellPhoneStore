const { getCartData } = require('~v1/helpers/getCartData');
const Coupon = require('~v1/models/Coupon');
const Order = require('~v1/models/Order');
const User = require('~v1/models/Account');
const Product = require('~v1/models/Product');
const Cart = require('~v1/models/Cart');

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
                shippingAddress,
                items,
                email,
                phone,
                name,
                shippingOption,
                total,
            } = req.body;

            if (!email || !name || !phone || !shippingAddress || !items || !shippingOption || !total) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields',
                });
            }

            
            let userId = req.user ? req.user._id : null;

            let user = await User.findOne({ email: email });

           
            if (!user) {
                const password = generatePassword();
                user = await User.create({
                    username: name,
                    email: email,
                    password: hashPassword(password),
                    phone,
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

                userId = user._id;
            }


            if(couponCode){
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
                phone,
                coupon: coupon ? coupon._id : null,
            };
            const order = await Order.create(orderData);

            if (req.user) {
                await Cart.deleteOne({ userId: req.user.userId });
            } else {
                res.clearCookie('cart');
            }

            for (const item of items) {
                await Product.findOneAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity }, $inc: { sold: item.quantity } },
                    { new: true },
                );
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


};
