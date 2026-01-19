import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lấy thông tin user từ LocalStorage (nếu đã đăng nhập trước đó)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hàm Đăng Nhập
  const login = async (email, password) => {
    try {
      // Gọi API login mà ta đã viết ở Backend
      const { data } = await axios.post('/api/users/login', { email, password });
      
      setUser(data); // Lưu vào State
      localStorage.setItem('userInfo', JSON.stringify(data)); // Lưu vào trình duyệt
      message.success('Đăng nhập thành công!');
      return true; // Báo hiệu thành công
    } catch (error) {
      // Lấy lỗi từ Backend trả về (nếu có)
      const msg = error.response?.data?.message || 'Đăng nhập thất bại';
      message.error(msg);
      return false;
    }
  };

  // Hàm Đăng Xuất
  const logout = () => {
    localStorage.removeItem('userInfo'); // Xóa khỏi bộ nhớ
    setUser(null); // Xóa khỏi State
    message.info('Đã đăng xuất');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};