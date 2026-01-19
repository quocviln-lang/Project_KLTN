const express = require('express');
const router = express.Router();
const { 
  createCoupon, 
  validateCoupon, 
  getCoupons,   // <--- Import
  deleteCoupon  // <--- Import
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route gốc: Admin lấy list & Admin tạo mới
router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);

// Route xóa
router.route('/:id').delete(protect, admin, deleteCoupon);

router.post('/validate', validateCoupon);

module.exports = router;