const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, totalPrice, shippingAddress, paymentMethod } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ success: false, error: 'No order items' });
        } else {
            const order = new Order({
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                totalPrice,
            });

            const createdOrder = await order.save();
            res.status(201).json({ success: true, data: createdOrder });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
};
