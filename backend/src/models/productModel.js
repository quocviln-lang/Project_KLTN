const mongoose = require('mongoose');

// 1. Schema cho Đánh giá (Review) - MỚI
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Để hiện ngày tháng đánh giá
  }
);

// 2. Schema cho Biến thể (Màu/ROM)
const variantSchema = mongoose.Schema({
  color: { type: String, required: true },
  memory: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  sku: { type: String, required: true },
});

// 3. Schema Sản phẩm chính
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    slug: { type: String },
    thumbnail: { type: String, required: true },
    images: [String],
    
    brand: { type: String, required: true },
    category: { type: String, required: true },
    
    description: { type: String, required: true },
    
    // Mảng chứa các bài đánh giá (Quan trọng!)
    reviews: [reviewSchema], 
    
    // Điểm trung bình
    rating: { type: Number, required: true, default: 0 },
    // Số lượng đánh giá
    numReviews: { type: Number, required: true, default: 0 },
    
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    
    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;