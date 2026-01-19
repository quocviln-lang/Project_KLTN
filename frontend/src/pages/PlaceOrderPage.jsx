import React, { useContext, useEffect } from 'react';
import { Row, Col, List, Image, Card, Button, Typography, Divider, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import axios from 'axios';

const { Title, Text } = Typography;

const PlaceOrderPage = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Tính toán chi phí
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 20000000 ? 0 : 50000; 
  const totalPrice = itemsPrice + shippingPrice;

  // 2. Nếu chưa chọn phương thức thanh toán, đá về trang Payment
  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  // 3. Xử lý sự kiện bấm nút "ĐẶT HÀNG"
  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // --- SỬA LỖI QUAN TRỌNG Ở ĐÂY ---
      // Map lại dữ liệu từ LocalStorage sang chuẩn Backend yêu cầu
      const orderItemsPayload = cartItems.map((item) => ({
        // Lỗi cũ: item._id (sai) -> Sửa thành: item.product (đúng với LocalStorage)
        product: item.product, 
        
        name: item.name,
        qty: Number(item.qty), // Ép kiểu số cho chắc chắn
        
        // Lỗi cũ: item.thumbnail (có thể thiếu) -> Ưu tiên lấy item.image
        image: item.image || item.thumbnail, 
        
        price: Number(item.price),
        
        // Xử lý trường hợp thiếu màu/bộ nhớ thì điền mặc định để không lỗi
        color: item.color || 'Mặc định',
        memory: item.memory || 'Mặc định'
      }));

      // Log ra để kiểm tra trước khi gửi (F12 -> Console)
      console.log("Dữ liệu gửi đi:", orderItemsPayload);

      // Gọi API tạo đơn hàng
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: orderItemsPayload, // Gửi danh sách đã sửa
          shippingAddress: shippingAddress,
          paymentMethod: paymentMethod,
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          totalPrice: totalPrice,
        },
        config
      );

      message.success('Đặt hàng thành công!');
      
      // Xử lý sau khi thành công
      clearCart(); // 1. Xóa giỏ hàng trong Context/LocalStorage
      localStorage.removeItem('cartItems'); // 2. Xóa cứng trong LocalStorage cho chắc
      
      navigate(`/order/${data._id}`); // 3. Chuyển hướng sang trang chi tiết đơn hàng
      
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      message.error(error.response?.data?.message || 'Đặt hàng thất bại');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row gutter={24}>
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
        <Col xs={24} md={16}>
          <List
            header={<Title level={4}>1. Địa chỉ giao hàng</Title>}
            bordered
            style={{ marginBottom: 20, background: '#fff' }}
          >
            <List.Item>
              <Text>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.country}
                <br />
                SĐT: {shippingAddress.phone}
              </Text>
            </List.Item>
          </List>

          <List
            header={<Title level={4}>2. Phương thức thanh toán</Title>}
            bordered
            style={{ marginBottom: 20, background: '#fff' }}
          >
            <List.Item>
              <Text strong>{paymentMethod}</Text>
            </List.Item>
          </List>

          <List
            header={<Title level={4}>3. Sản phẩm đặt mua</Title>}
            bordered
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Image width={50} src={item.image || item.thumbnail} preview={false} />}
                  title={<Link to={`/product/${item.product}`}>{item.name}</Link>}
                  description={`${item.qty} x ${item.price?.toLocaleString()}đ = ${(item.qty * item.price).toLocaleString()}đ`}
                />
                <div>{item.color || 'Mặc định'} / {item.memory || 'Mặc định'}</div>
              </List.Item>
            )}
          />
        </Col>

        {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
        <Col xs={24} md={8}>
          <Card title="Tổng kết đơn hàng" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Row justify="space-between" style={{ marginBottom: 10 }}>
              <Text>Tạm tính:</Text>
              <Text>{itemsPrice.toLocaleString()}đ</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 10 }}>
              <Text>Phí vận chuyển:</Text>
              <Text>{shippingPrice === 0 ? 'Miễn phí' : `${shippingPrice.toLocaleString()}đ`}</Text>
            </Row>
            <Divider />
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Title level={4}>Tổng cộng:</Title>
              <Title level={4} type="danger">{totalPrice.toLocaleString()}đ</Title>
            </Row>

            <Button 
              type="primary" 
              block 
              size="large" 
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0}
            >
              XÁC NHẬN ĐẶT HÀNG
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderPage;