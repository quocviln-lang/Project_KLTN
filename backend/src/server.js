const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const couponRoutes = require('./routes/couponRoutes');
// 1. Cấu hình biến môi trường
dotenv.config();

// 2. Kết nối Database
connectDB();

const app = express();

// 3. Middleware nhận dữ liệu JSON từ Client gửi lên
app.use(express.json()); 

// 4. API Test thử (Route mặc định)
app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/coupons', couponRoutes);

const uploadsFolder = path.join(__dirname, '../uploads'); 
app.use('/uploads', express.static(uploadsFolder));
// 5. Lắng nghe port
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));