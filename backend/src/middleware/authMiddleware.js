const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header gửi lên có Token không (Dạng: Bearer eyJhbGci...)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token ra (bỏ chữ Bearer ở đầu)
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gắn vào req.user (trừ trường password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có token, không được phép truy cập' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Là Admin thì cho đi tiếp
  } else {
    res.status(401).json({ message: 'Không có quyền Admin' }); // Chặn lại ngay
  }
};

module.exports = { protect, admin };