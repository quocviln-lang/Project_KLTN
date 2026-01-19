const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    // Ai là người đặt đơn này? (Liên kết với bảng User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Danh sách hàng mua
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        // Quan trọng: Lưu cả màu và bộ nhớ để biết khách mua loại nào
        color: { type: String }, 
        memory: { type: String },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    // Địa chỉ giao hàng
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
    },
    // Phương thức thanh toán (PayPal, COD...)
    paymentMethod: {
      type: String,
      required: true,
    },
    // Kết quả thanh toán (Dùng cho PayPal sau này)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    // Các loại phí
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    
    // Trạng thái đơn hàng
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;