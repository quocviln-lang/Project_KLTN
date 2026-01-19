import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer'; // <--- 1. Import Footer mới

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import ProfilePage from './pages/ProfilePage';
import UserListPage from './pages/UserListPage';
import ProductListPage from './pages/ProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import OrderListPage from './pages/OrderListPage';
import OrderPage from './pages/OrderPage';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import MyOrdersPage from './pages/MyOrdersPage';
import CouponListPage from './pages/CouponListPage';
import Chatbox from './components/Chatbox';

// 2. Chỉ lấy Content, BỎ Footer ra khỏi đây để không trùng tên
const { Content } = Layout; 

const App = () => {
  return (
    <Router>
      {/* Thêm display: flex để footer luôn nằm dưới cùng dù nội dung ngắn */}
      <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <Header />
        
        {/* flex: 1 để Content giãn ra, đẩy Footer xuống đáy */}
        <Content style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} /> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={<UserListPage />} />
            <Route path="/admin/products" element={<ProductListPage />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
            <Route path="/admin/orders" element={<OrderListPage />} />
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/search/:keyword" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            <Route path="/admin/coupons" element={<CouponListPage />} />
          </Routes>
        </Content>

        {/* 3. Dùng component Footer xịn xò mới làm */}
        <Footer />
        <Chatbox />
      </Layout>
    </Router>
  );
};

export default App;