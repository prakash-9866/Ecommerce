const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');


const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const orders = await Order.find({});
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalSales
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort('-createdAt');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        
        if (req.body.status) {
            order.status = req.body.status;
            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else {
                order.isDelivered = false;
            }
        } else {
            
            order.isDelivered = req.body.isDelivered;
            if (req.body.isDelivered) {
                order.deliveredAt = Date.now();
                order.status = 'Delivered';
            } else {
                order.status = 'Processing';
            }
        }

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        if (user.isAdmin) {
            return res.status(400).json({ success: false, error: 'Cannot delete admin user' });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    deleteUser
};
