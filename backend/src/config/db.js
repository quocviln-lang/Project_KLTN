const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Thử kết nối với chuỗi MONGO_URI trong file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Nếu thành công, in ra Terminal để mình biết
    // cyan.underline là màu sắc (cần cài thêm thư viện colors nếu thích, không thì bỏ qua)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Nếu lỗi (ví dụ chưa bật MongoDB), in ra lỗi và dừng chương trình
    console.error(`Error: ${error.message}`);
    process.exit(1); // 1 nghĩa là thoát với lỗi
  }
};

module.exports = connectDB;