const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// Hàm hỗ trợ tạo Slug (Biến tên thành đường dẫn: "iPhone 15" -> "iphone-15")
const createSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Lấy từ khóa từ URL (ví dụ: ?keyword=iphone)
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword, // Tìm gần đúng (Regex)
          $options: 'i',             // Không phân biệt hoa thường (Case insensitive)
        },
      }
    : {};

  // Tìm trong DB với điều kiện keyword (nếu không có keyword thì tìm tất cả)
  const products = await Product.find({ ...keyword });
  
  res.json(products);
});

// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Xóa một sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Đã xóa sản phẩm thành công' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

// @desc    Tạo sản phẩm mẫu (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Tạo dữ liệu giả nhưng ĐẦY ĐỦ để không bị lỗi validation
  const product = new Product({
    name: 'Sản phẩm mẫu ' + Date.now(),
    slug: 'san-pham-mau-' + Date.now(),
    price: 0,
    user: req.user._id,
    thumbnail: '/images/sample.jpg', // Ảnh mặc định
    images: ['/images/sample.jpg'],
    brand: 'Apple',        // Điền cứng để tránh lỗi
    category: 'Điện thoại', // Điền cứng để tránh lỗi
    countInStock: 0,
    numReviews: 0,
    description: 'Mô tả sản phẩm...',
    variants: [
      { 
        color: 'Mặc định', 
        memory: '128GB', 
        price: 0, 
        countInStock: 0,
        sku: 'SAMPLE-SKU-' + Date.now() // Phải có SKU
      }
    ] 
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { 
    name, price, description, image, brand, category, countInStock 
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.slug = createSlug(name); 
    product.price = price;
    product.description = description;
    product.thumbnail = image || product.thumbnail; 
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // --- FIX LỖI "Path user is required" ---
    // Luôn gán User hiện tại (Admin) cho sản phẩm khi update
    // Để đảm bảo sản phẩm luôn có chủ sở hữu
    product.user = req.user._id; 
    // ---------------------------------------

    // Logic đồng bộ giá vào biến thể
    if (product.variants && product.variants.length > 0) {
      product.variants[0].price = price;
      product.variants[0].countInStock = countInStock;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

const getRecommendations = asyncHandler(async (req, res) => {
  const currentProduct = await Product.findById(req.params.id);

  if (!currentProduct) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }

  // Lấy tất cả sản phẩm khác (trừ sản phẩm hiện tại)
  const allProducts = await Product.find({ _id: { $ne: currentProduct._id } });

  // --- THUẬT TOÁN TÍNH ĐIỂM (WEIGHTED SCORING) ---
  const scoredProducts = allProducts.map((product) => {
    let score = 0;

    // 1. Cùng Danh mục (Quan trọng nhất) -> +5 điểm
    if (product.category === currentProduct.category) score += 5;

    // 2. Cùng Thương hiệu -> +3 điểm
    if (product.brand === currentProduct.brand) score += 3;

    // 3. Tầm giá (Chênh lệch < 30%) -> +2 điểm
    // Giúp gợi ý các sản phẩm cùng phân khúc
    const priceDiff = Math.abs(product.price - currentProduct.price);
    if (priceDiff <= currentProduct.price * 0.3) score += 2;

    // 4. (Nâng cao) Gợi ý phụ kiện đi kèm
    // Nếu đang xem Điện thoại mà sản phẩm kia là Phụ kiện -> +4 điểm
    // (Điều kiện: Phải cùng hãng. VD: Xem iPhone thì gợi ý ốp lưng Apple)
    if (currentProduct.category === 'Điện thoại' && product.category === 'Phụ kiện') {
        if (product.brand === currentProduct.brand) score += 4;
    }

    return { ...product.toObject(), score };
  });

  // Sắp xếp theo điểm số giảm dần & lấy 4 sản phẩm điểm cao nhất
  const recommendations = scoredProducts
    .sort((a, b) => b.score - a.score)
    .filter(p => p.score > 0) // Chỉ lấy sản phẩm có liên quan
    .slice(0, 4);

  res.json(recommendations);
});

// @desc    Tạo đánh giá sản phẩm mới
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // --- SỬA LỖI Ở ĐÂY (QUAN TRỌNG) ---
    // Nếu sản phẩm cũ chưa có mảng reviews, ta khởi tạo nó là mảng rỗng
    if (!product.reviews) {
      product.reviews = [];
    }
    // ----------------------------------

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Đánh giá đã được thêm' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getRecommendations,
  createProductReview,
};