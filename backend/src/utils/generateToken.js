const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Tạo token chứa ID của user, sống trong 30 ngày
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;