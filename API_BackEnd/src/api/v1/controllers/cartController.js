const Cart = require('~v1/models/Cart');
const Product = require('~v1/models/Product');
const { getCartData } = require('~v1/helpers/getCartData');

const Coupon = require('~v1/models/Coupon');

const axios = require('axios');

const fs = require('fs');

const getShippingFee = async (data) => {
    try {
        const response = await axios.get(
            'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
            {
                params: data, // Use 'params' for GET requests
                headers: {
                    shop_id: 5353427,
                    token: '373af170-9446-11ef-9620-5e559486e6bb',
                },
            },
        );

        return response.data.data.total;
    } catch (error) {
        console.error('Error:', error);
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

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: 'Product not found',
            });
        }

        if (product.variants.length > 0) {

            const variant = product.variants.find(
                (v) => v._id.toString() === variantId,
            );
            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant not found',
                });
            }
        }

        // check if product is in stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product out of stock',
            });
        }

        let cart;

        if (req.user) {
            cart =
                (await Cart.findOne({ userId: req.user.userId })) ||
                new Cart({ userId: req.user.userId });
            const existingItem = cart.items.find(
                (item) =>
                    item.productId.toString() === productId &&
                    item.variantId?.toString() === variantId,
            );

            if (existingItem) {
                if (product.stock < existingItem.quantity + quantity) {
                    return res.status(400).json({
                        success: false,
                        message: 'Product out of stock',
                    });
                }
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, variantId });
            }

            cart.userId = req.user.userId;
            await cart.save();
            console.log('Cart saved db');
        } else {
            cart = JSON.parse(req.cookies.cart || '{}');
            const itemIndex = cart.items?.findIndex(
                (item) =>
                    item.productId === productId &&
                    item.variantId === variantId,
            );

            if (itemIndex >= 0) {
                if (product.stock < cart.items[itemIndex].quantity + quantity) {
                    return res.status(400).json({
                        success: false,
                        message: 'Product out of stock',
                    });
                }
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items = [
                    ...(cart.items || []),
                    { productId, quantity, variantId },
                ];
            }
            console.log('Setting cookie with cart:', JSON.stringify(cart));
            res.cookie('cart', JSON.stringify(cart), {
                httpOnly: false,
                sameSite: 'none',
                secure: false,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });

            console.log('Cart saved cookie');
        }

        res.status(200).json({ success: true, cart });
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
                message: 'Invalid or expired coupon',
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
        const districtData = await fs.promises.readFile('src/api/v1/controllers/city_district.json', 
            'utf8',
        );
        const districts = JSON.parse(districtData);
        const province = districts.find(
            (item) =>
                item.ProvinceName.toLowerCase() ===
                shippingAddress.city.toLowerCase(),
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
                message: 'Invalid address',
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

        let cartData = await getCartData(req);

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
                if (coupon.type === 'percent') {
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
