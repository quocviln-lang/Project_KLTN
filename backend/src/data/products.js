const products = [
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    image: '/images/iphone-15-pro-max.jpg', // Sau này sẽ để ảnh ở thư mục public
    thumbnail: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png',
    description: 'iPhone 15 Pro Max thiết kế Titan tự nhiên, chip A17 Pro mạnh mẽ nhất.',
    brand: 'Apple',
    category: '65a6f234...', // Sẽ được thay thế bằng ID thật khi chạy script
    specs: {
        screen: "6.7 inch",
        cpu: "Apple A17 Pro",
        ram: "8GB",
        battery: "4422 mAh"
    },
    rating: 4.5,
    numReviews: 12,
    variants: [
        { sku: "IP15PM-256", color: "Titan Tự Nhiên", memory: "256GB", price: 34990000, countInStock: 10 },
        { sku: "IP15PM-512", color: "Titan Xanh", memory: "512GB", price: 39990000, countInStock: 5 }
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    image: '/images/samsung-s24.jpg',
    thumbnail: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-222.png',
    description: 'Quyền năng Galaxy AI, bút S-Pen thần thánh, camera 200MP.',
    brand: 'Samsung',
    category: 'SamsungID', 
    specs: {
        screen: "6.8 inch",
        cpu: "Snapdragon 8 Gen 3",
        ram: "12GB",
        battery: "5000 mAh"
    },
    rating: 5,
    numReviews: 8,
    variants: [
        { sku: "S24U-256", color: "Xám Titan", memory: "256GB", price: 31990000, countInStock: 20 },
        { sku: "S24U-512", color: "Đen Titan", memory: "512GB", price: 35990000, countInStock: 0 }
    ]
  },
  {
    name: 'Xiaomi 14',
    slug: 'xiaomi-14',
    image: '/images/xiaomi-14.jpg',
    thumbnail: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14_2_1_1.png',
    description: 'Ống kính Leica huyền thoại, thiết kế nhỏ gọn.',
    brand: 'Xiaomi',
    category: 'XiaomiID',
    specs: {
        screen: "6.36 inch",
        cpu: "Snapdragon 8 Gen 3",
        ram: "12GB",
        battery: "4610 mAh"
    },
    rating: 4,
    numReviews: 4,
    variants: [
        { sku: "MI14-256", color: "Xanh Lá", memory: "256GB", price: 19990000, countInStock: 15 }
    ]
  },
];

module.exports = products;