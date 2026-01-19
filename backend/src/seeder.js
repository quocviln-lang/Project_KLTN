const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // (Tùy chọn) cho đẹp
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

// 1. Cấu hình
dotenv.config();
connectDB(); // Kết nối DB để nạp dữ liệu

// 2. Hàm Nhập dữ liệu (Import)
const importData = async () => {
  try {
    // Xóa sạch dữ liệu cũ để tránh trùng lặp
    await User.deleteMany();
    await Product.deleteMany();

    // Tạo User trước
    const createdUsers = await User.create(users);
    
    // Lấy ID của ông Admin (người đầu tiên trong mảng users)
    const adminUser = createdUsers[0]._id;

    // Gán trường 'category' tạm thời (để đơn giản hóa demo này ta fix cứng CategoryID sau)
    // Và gán người tạo sản phẩm là Admin
    const sampleProducts = products.map((product) => {
      // Ở đây ta tạm thời dùng ID giả cho Category, bài sau ta sẽ tạo Category thật
      return { ...product, user: adminUser, category: new mongoose.Types.ObjectId() };
    });

    // Tạo Products
    await Product.create(sampleProducts);

    console.log('Data Imported Thành Công!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// 3. Hàm Xóa dữ liệu (Destroy) - Dùng khi cần reset sạch
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Kiểm tra lệnh chạy từ terminal
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}