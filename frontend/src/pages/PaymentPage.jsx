import React, { useState, useContext, useEffect } from 'react';
import { Form, Radio, Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const { Title } = Typography;

const PaymentPage = () => {
  const { savePaymentMethod, shippingAddress } = useContext(CartContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // Nếu chưa nhập địa chỉ thì đá về trang địa chỉ (Validation)
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const onFinish = () => {
    savePaymentMethod(paymentMethod);
    navigate('/placeorder'); // Chuyển sang bước cuối: Đặt hàng
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      {/* Bước 3: Thanh toán */}
      <CheckoutSteps step1 step2 step3 />

      <Card style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Phương Thức Thanh Toán</Title>
        
        <Form onFinish={onFinish}>
          <Form.Item>
            <Title level={5}>Chọn phương thức:</Title>
            <Radio.Group 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                value={paymentMethod}
                style={{ display: 'flex', flexDirection: 'column', gap: 15 }}
            >
              <Radio value="PayPal">PayPal hoặc Thẻ Tín Dụng</Radio>
              <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
            </Radio.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: 20 }}>
            Tiếp tục
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentPage;