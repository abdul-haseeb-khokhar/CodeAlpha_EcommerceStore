const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;