const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456', // Pass này sẽ được hash trong code seeder
    isAdmin: true,      // Đây là sếp
  },
  {
    name: 'Nguyen Van A',
    email: 'user@example.com',
    password: '123456',
    isAdmin: false,     // Đây là khách
  },
  {
    name: 'Tran Thi B',
    email: 'khachhang@example.com',
    password: '123456',
    isAdmin: false,
  },
];

module.exports = users;