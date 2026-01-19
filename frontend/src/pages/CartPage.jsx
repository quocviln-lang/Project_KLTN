import React, { useContext, useState } from 'react';
import { Row, Col, List, Image, InputNumber, Button, Card, Typography, message, Empty, Input, Tag } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State cho Voucher
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [isApplied, setIsApplied] = useState(false);

  // 1. Tính toán giá tiền
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 20000000 ? 0 : 50000; 
  
  const discountAmount = (itemsPrice * discountPercent) / 100;
  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  // 2. Xử lý sự kiện Thay đổi số lượng
  const handleQtyChange = (val, item) => {
    if (val > 0 && val <= item.countInStock) {
      // SỬA Ở ĐÂY: Truyền nguyên object item nhưng ghi đè qty mới
      addToCart({ ...item, qty: val });
    }
  };

  // 3. Xử lý Áp dụng Voucher
  const applyCouponHandler = async () => {
    try {
      const { data } = await axios.post('/api/coupons/validate', { name: coupon });
      setDiscountPercent(data.discount);
      setIsApplied(true);
      message.success(`Đã áp dụng mã: Giảm ${data.discount}%`);
      localStorage.setItem('couponInfo', JSON.stringify(data));
    } catch (error) {
      message.error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
      setDiscountPercent(0);
      setIsApplied(false);
    }
  };

  // 4. Xử lý khi bấm Thanh Toán
  const checkoutHandler = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Title level={2} style={{ marginBottom: 20 }}>
        <ShoppingCartOutlined /> Giỏ Hàng ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})
      </Title>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
           <Empty description="Giỏ hàng trống" />
           <Link to="/">
             <Button type="primary" style={{ marginTop: 20 }}>Tiếp tục mua sắm</Button>
           </Link>
        </div>
      ) : (
        <Row gutter={32}>
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <Col xs={24} md={16}>
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <Card style={{ marginBottom: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <Row align="middle" gutter={16}>
                    {/* Ảnh sản phẩm */}
                    <Col span={4}>
                      <Image 
                        src={item.image || item.thumbnail} 
                        alt={item.name} 
                        preview={false} 
                        style={{ borderRadius: 8 }}
                      />
                    </Col>
                    
                    {/* Tên & Phân loại */}
                    <Col span={8}>
                      <Link to={`/product/${item._id}`}>
                        <Text strong style={{ fontSize: 16 }}>{item.name}</Text>
                      </Link>
                      <div>
                        <Text type="secondary">Phân loại: {item.color || 'Tiêu chuẩn'} / {item.memory || 'Tiêu chuẩn'}</Text>
                      </div>
                      <Text type="danger" strong>{item.price.toLocaleString()}đ</Text>
                    </Col>

                    {/* Số lượng */}
                    <Col span={6} style={{ textAlign: 'center' }}>
                       <InputNumber 
                         min={1} 
                         max={item.countInStock} 
                         value={item.qty} 
                         // Sửa lại logic gọi hàm thay đổi số lượng
                         onChange={(val) => handleQtyChange(val, item)} 
                       />
                       <div style={{ fontSize: 12, color: '#888', marginTop: 5 }}>
                         Kho: {item.countInStock}
                       </div>
                    </Col>

                    {/* Nút Xóa (QUAN TRỌNG: ĐÃ SỬA TẠI ĐÂY) */}
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        // --- SỬA LỖI: Truyền đủ 3 tham số (ID, Color, Memory) ---
                        onClick={() => removeFromCart(item._id, item.color, item.memory)}
                      >
                        Xóa
                      </Button>
                    </Col>
                  </Row>
                </Card>
              )}
            />
          </Col>

          {/* CỘT PHẢI: TỔNG KẾT & VOUCHER */}
          <Col xs={24} md={8}>
            <Card title="Tổng quan đơn hàng" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              
              <div style={{ marginBottom: 20 }}>
                 <Text strong>Mã giảm giá / Voucher</Text>
                 <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <Input 
                      placeholder="Nhập mã (VD: TET2026)" 
                      value={coupon} 
                      onChange={(e) => setCoupon(e.target.value)} 
                      disabled={isApplied}
                    />
                    <Button type="primary" onClick={applyCouponHandler} disabled={!coupon || isApplied}>
                      Áp dụng
                    </Button>
                 </div>
                 {isApplied && (
                   <Tag color="green" style={{ marginTop: 10, width: '100%', textAlign: 'center' }}>
                     Đã áp dụng mã giảm {discountPercent}%
                   </Tag>
                 )}
              </div>
              
              <div style={{ borderTop: '1px solid #f0f0f0', margin: '20px 0' }}></div>

              <Row justify="space-between" style={{ marginBottom: 10 }}>
                <Text>Tạm tính:</Text>
                <Text>{itemsPrice.toLocaleString()}đ</Text>
              </Row>
              
              <Row justify="space-between" style={{ marginBottom: 10 }}>
                <Text>Phí vận chuyển:</Text>
                <Text>{shippingPrice === 0 ? 'Miễn phí' : `${shippingPrice.toLocaleString()}đ`}</Text>
              </Row>

              {isApplied && (
                <Row justify="space-between" style={{ marginBottom: 10 }}>
                  <Text type="success">Voucher giảm giá:</Text>
                  <Text type="success">- {discountAmount.toLocaleString()}đ</Text>
                </Row>
              )}

              <div style={{ borderTop: '1px solid #f0f0f0', margin: '10px 0' }}></div>

              <Row justify="space-between" style={{ marginBottom: 20 }}>
                <Title level={4}>Tổng cộng:</Title>
                <Title level={4} type="danger">{totalPrice.toLocaleString()}đ</Title>
              </Row>

              <Button 
                type="primary" 
                block 
                size="large" 
                onClick={checkoutHandler}
                style={{ height: 50, fontSize: 16, fontWeight: 'bold' }}
              >
                TIẾN HÀNH THANH TOÁN
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartPage;  