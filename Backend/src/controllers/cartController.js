const Cart = require('../models/cartModel');

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [{ product, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === product);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity || 1;
            } else {
                cart.items.push({ product, quantity: quantity || 1 });
            }
            await cart.save();
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
};
