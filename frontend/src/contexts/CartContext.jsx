import React, { createContext, useState, useEffect } from 'react';
import { message } from 'antd';

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Load từ LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    return savedAddress ? JSON.parse(savedAddress) : {};
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('paymentMethod') || 'PayPal';
  });

  // Lưu thay đổi vào LocalStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  // --- HÀM SỬA CHÍNH: CHỈ NHẬN 1 OBJECT ITEM ---
  const addToCart = (newItem) => {
    // newItem phải có dạng: { _id, name, price, qty, color, memory, ... }
    
    // Tìm xem sản phẩm này (cùng ID, cùng Màu, cùng Bộ nhớ) đã có trong giỏ chưa
    const existItem = cartItems.find((x) => 
      x._id === newItem._id && 
      x.color === newItem.color && 
      x.memory === newItem.memory
    );

    if (existItem) {
      // Nếu có rồi -> Ghi đè item cũ bằng item mới (số lượng mới sẽ được cập nhật)
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id && x.color === newItem.color && x.memory === newItem.memory
            ? newItem 
            : x
        )
      );
    } else {
      // Nếu chưa có -> Thêm mới
      setCartItems([...cartItems, newItem]);
      message.success('Đã thêm vào giỏ hàng!');
    }
  };

  const removeFromCart = (id, color, memory) => {
    setCartItems(cartItems.filter((x) => !(x._id === id && x.color === color && x.memory === memory)));
    message.warning('Đã xóa sản phẩm');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const saveShippingAddress = (data) => setShippingAddress(data);
  const savePaymentMethod = (method) => setPaymentMethod(method);

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        removeFromCart,
        shippingAddress,       
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};