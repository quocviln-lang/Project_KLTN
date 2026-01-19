const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,    // Đã import được
  updateUserProfile, // Đã import được
  getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);

// Route Profile: Vừa xem (GET), vừa sửa (PUT)
router
  .route('/profile')
  .get(protect, getUserProfile)       // Dòng này trước đây gây lỗi
  .put(protect, updateUserProfile);   // Dòng này trước đây gây lỗi

// Route Admin: Lấy danh sách user
router.route('/').get(protect, admin, getUsers);

module.exports = router;