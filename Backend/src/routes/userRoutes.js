const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Chain the same path methods
router.route('/').get(getUsers).post(createUser);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;
