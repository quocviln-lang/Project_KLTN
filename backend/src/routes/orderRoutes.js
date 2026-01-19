const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getDashboardStats,
  updateOrderToPaid,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route gốc: User tạo đơn, Admin xem tất cả đơn
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

// Route lấy đơn của user (phải đặt trước route /:id)
router.route('/myorders').get(protect, getMyOrders);
// Route thống kê Dashboard (Admin)
router.route('/dashboard').get(protect, admin, getDashboardStats);
// Route chi tiết đơn hàng
router.route('/:id').get(protect, getOrderById);
// Route Admin cập nhật đã thanh toán
router.route('/:id/pay').put(protect, admin, updateOrderToPaid);
// Route Admin cập nhật đã giao hàng
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;