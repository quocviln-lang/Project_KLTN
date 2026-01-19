const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, uppercase: true }, // Tên mã: SALE50
    expiry: { type: Date, required: true }, // Ngày hết hạn
    discount: { type: Number, required: true }, // % giảm giá (VD: 10 = 10%)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);