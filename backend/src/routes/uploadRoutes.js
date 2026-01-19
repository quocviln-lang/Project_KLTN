const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config(); // Load biến môi trường từ file .env

// 1. Cấu hình Cloudinary (Lấy chìa khóa từ .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Cấu hình nơi lưu trữ là Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kltn_phone_shop', // Tên thư mục trên Cloudinary (tùy bạn đặt)
    allowed_formats: ['jpg', 'png', 'jpeg'], // Chỉ cho phép file ảnh
    // transformation: [{ width: 500, height: 500, crop: 'limit' }], // (Tùy chọn) Tự động resize ảnh nếu cần
  },
});

const upload = multer({ storage: storage });

// 3. Route Upload
router.post('/', upload.single('image'), (req, res) => {
  // Khi upload thành công, Cloudinary trả về đường dẫn trong req.file.path
  // Trả link này về cho Frontend hiển thị
  res.send(req.file.path);
});

module.exports = router;