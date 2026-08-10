const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    deleteUser
} = require('../controllers/adminController');

// All routes here are protected and require admin privileges
router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
