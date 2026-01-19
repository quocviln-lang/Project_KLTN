const asyncHandler = require('express-async-handler');
const Coupon = require('../models/couponModel');

// @desc    Tạo mã giảm giá mới
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { name, expiry, discount } = req.body;
  const coupon = await Coupon.create({ name: name.toUpperCase(), expiry, discount });
  res.json(coupon);
});

// @desc    Kiểm tra mã giảm giá
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const coupon = await Coupon.findOne({ name: name.toUpperCase() });

  if (coupon && new Date() < coupon.expiry) {
    res.json({
      name: coupon.name,
      discount: coupon.discount, // Trả về số % giảm
    });
  } else {
    res.status(404);
    throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
  }
});

// @desc    Lấy danh sách tất cả coupon
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }); // Mới nhất lên đầu
  res.json(coupons);
});

// @desc    Xóa coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Đã xóa mã giảm giá' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy mã');
  }
});

module.exports = { 
    createCoupon, 
    validateCoupon, 
    getCoupons, 
    deleteCoupon 
};