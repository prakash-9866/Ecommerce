const express = require('express');
const router = express.Router();
const { getCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);

module.exports = router;
