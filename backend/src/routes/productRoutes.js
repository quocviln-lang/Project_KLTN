const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  deleteProduct, 
  createProduct, 
  updateProduct,
  getRecommendations, 
  createProductReview, 

} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);

// --- MỚI: Route gợi ý (Đặt TRƯỚC route /:id để tránh trùng lặp) ---
// Frontend sẽ gọi: /api/products/65a123.../recommendations
router.route('/:id/recommendations').get(getRecommendations);
// ------------------------------------------------------------------
router.route('/:id/reviews').post(protect, createProductReview);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;