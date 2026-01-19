import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const { Title } = Typography;

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);
  const navigate = useNavigate();

  // Khi form submit thành công
  const onFinish = (values) => {
    saveShippingAddress(values); // Lưu vào Context
    navigate('/payment');        // Chuyển sang bước thanh toán (Sẽ làm sau)
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      {/* Thanh tiến trình: Đang ở bước 2 (Giao hàng) */}
      <CheckoutSteps step1 step2 />

      <Card style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Địa Chỉ Giao Hàng</Title>
        
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={shippingAddress} // Tự điền nếu đã nhập trước đó
        >
          <Form.Item
            label="Địa chỉ chi tiết"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Số nhà, tên đường..." size="large" />
          </Form.Item>

          <Form.Item
            label="Thành phố / Tỉnh"
            name="city"
            rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
          >
            <Input placeholder="Ví dụ: TP. Hồ Chí Minh" size="large" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại người nhận"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="09xxxxxxx" size="large" />
          </Form.Item>

          <Form.Item
            label="Quốc gia"
            name="country"
            rules={[{ required: true, message: 'Vui lòng nhập quốc gia!' }]}
          >
             <Input placeholder="Việt Nam" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            Tiếp tục đến Thanh toán
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ShippingPage;