const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', addOrderItems);
router.get('/myorders', getMyOrders);

module.exports = router;
