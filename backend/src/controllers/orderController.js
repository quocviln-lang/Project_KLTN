const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có sản phẩm nào trong giỏ hàng');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Lấy chi tiết 1 đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  // populate để lấy thêm tên và email của người đặt từ bảng User
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Lấy danh sách đơn hàng của user đang đăng nhập
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Lấy tất cả đơn hàng (Chức năng Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Cập nhật trạng thái: Đã giao hàng (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

// @desc    Lấy số liệu thống kê cho Dashboard
// @route   GET /api/orders/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Đếm tổng số lượng
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersCount = await Order.countDocuments();

  // 2. Tính tổng doanh thu (Chỉ tính các đơn đã thanh toán)
  // Dùng hàm aggregate của MongoDB để cộng tổng cột totalPrice
  const totalRevenueData = await Order.aggregate([
    { $match: { isPaid: true } }, // Chỉ lấy đơn đã trả tiền
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
  ]);

  // Xử lý trường hợp chưa có đơn nào thì trả về 0
  const totalRevenue =
    totalRevenueData.length > 0 ? totalRevenueData[0].totalSales : 0;

  // 3. Lấy dữ liệu cho biểu đồ (Doanh thu theo ngày)
  // Lấy tất cả đơn hàng, Frontend sẽ tự nhóm theo ngày để vẽ biểu đồ cho linh hoạt
  const orders = await Order.find({ isPaid: true }).select('totalPrice createdAt');

  res.json({
    productsCount,
    usersCount,
    ordersCount,
    totalRevenue,
    orders, // Trả về danh sách đơn rút gọn để vẽ biểu đồ
  });
});

// @desc    Admin xác nhận đã thanh toán (Dùng cho Tiền mặt/Chuyển khoản)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Nếu chưa có kết quả thanh toán từ cổng online, ta ghi tạm là 'Admin xác nhận'
    order.paymentResult = {
      id: req.user._id,
      status: 'COMPLETED',
      update_time: Date.now(),
      email_address: req.user.email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
});

module.exports = {
  addOrderItems,
  getOrderById, // <--- MỚI
  updateOrderToDelivered, // <--- MỚI
  getMyOrders,
  getOrders, // <--- MỚI
  getDashboardStats, // <--- MỚI
  updateOrderToPaid, // <--- MỚI
};