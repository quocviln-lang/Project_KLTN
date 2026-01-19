const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true, // Không được trùng email
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập đúng định dạng email', // Regex kiểm tra email hợp lệ
      ],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'], // Validate độ dài
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Mặc định là khách hàng (user thường)
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    // [QUAN TRỌNG CHO AI]
    // Lưu lịch sử những sản phẩm user đã xem/mua để AI học sở thích
    recommendationData: {
      viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
      boughtCategories: [String], // Ví dụ: ['Apple', 'Samsung']
    },
  },
  {
    timestamps: true,
  }
);

// --- MIDDLEWARE & METHODS (Phần nâng cao giúp ghi điểm) ---

// 1. Method: Kiểm tra mật khẩu khi đăng nhập
// So sánh mật khẩu người dùng nhập vào (plain text) với mật khẩu đã mã hóa trong DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Middleware: Tự động mã hóa mật khẩu trước khi Lưu (Save)
userSchema.pre('save', async function (next) {
  // Nếu mật khẩu không bị sửa đổi (ví dụ chỉ sửa địa chỉ), thì bỏ qua bước này
  if (!this.isModified('password')) {
    next();
  }

  // Tạo muối (salt) để mã hóa mạnh hơn
  const salt = await bcrypt.genSalt(10);
  // Hash mật khẩu
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;