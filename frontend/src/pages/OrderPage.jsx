import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, List, Image, Card, Typography, Divider, message, Button, Tag, Spin } from 'antd';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const OrderPage = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDeliver, setLoadingDeliver] = useState(false); // Loading cho nút bấm Admin

  // 1. Lấy thông tin đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error('Lỗi tải đơn hàng');
        setLoading(false);
      }
    };

    if (!order || order._id !== id) {
      fetchOrder();
    }
  }, [id, user, order]);

  // 2. Hàm xử lý: Admin bấm "Đã giao hàng"
  const deliverHandler = async () => {
    setLoadingDeliver(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      
      message.success('Đã cập nhật trạng thái giao hàng!');
      setOrder({ ...order, isDelivered: true }); // Cập nhật giao diện ngay lập tức
      setLoadingDeliver(false);
    } catch (error) {
        console.log(error);
      message.error('Lỗi cập nhật trạng thái');
      setLoadingDeliver(false);
    }
  };
    // 3. Hàm xử lý: Admin bấm "Đã thanh toán"
  const payHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/pay`, {}, config);
      message.success('Đã xác nhận thanh toán!');
      setOrder({ ...order, isPaid: true, paidAt: Date.now() }); // Cập nhật giao diện
    } catch (error) {
        console.log(error);
      message.error('Lỗi cập nhật thanh toán');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!order) return <p>Không tìm thấy đơn hàng</p>;

  return (
    <div style={{ padding: '30px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={3}>Đơn hàng: {order._id}</Title>
      
      <Row gutter={24}>
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
        <Col span={16}>
          <List itemLayout="vertical">
            {/* 1. VẬN CHUYỂN */}
            <List.Item>
              <Title level={4}>Vận Chuyển</Title>
              <p><strong>Tên:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a></p>
              <p>
                <strong>Địa chỉ:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Tag color="green">Đã giao lúc {new Date(order.deliveredAt).toLocaleString()}</Tag>
              ) : (
                <Tag color="volcano">Chưa giao hàng</Tag>
              )}
            </List.Item>
            
            <Divider />

            {/* 2. THANH TOÁN */}
            <List.Item>
              <Title level={4}>Thanh Toán</Title>
              <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
              {order.isPaid ? (
                <Tag color="green">Đã thanh toán lúc {new Date(order.paidAt).toLocaleString()}</Tag>
              ) : (
                <Tag color="volcano">Chưa thanh toán</Tag>
              )}
            </List.Item>

            <Divider />

            {/* 3. SẢN PHẨM ĐÃ MUA */}
            <List.Item>
              <Title level={4}>Sản Phẩm</Title>
              <List
                itemLayout="horizontal"
                dataSource={order.orderItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Image width={50} src={item.image} />}
                      title={<Link to={`/product/${item.product}`}>{item.name}</Link>}
                      description={`${item.qty} x ${item.price.toLocaleString()}đ = ${(item.qty * item.price).toLocaleString()}đ`}
                    />
                  </List.Item>
                )}
              />
            </List.Item>
          </List>
        </Col>

        {/* CỘT PHẢI: TỔNG KẾT HÓA ĐƠN */}
        <Col span={8}>
          <Card>
            <Title level={4} style={{ textAlign: 'center' }}>Tổng Kết Đơn Hàng</Title>
            <Divider />
            <Row justify="space-between">
              <Text>Tiền hàng:</Text>
              <Text>{order.itemsPrice?.toLocaleString()}đ</Text>
            </Row>
            <Row justify="space-between" style={{ marginTop: 10 }}>
              <Text>Phí ship:</Text>
              <Text>{order.shippingPrice?.toLocaleString()}đ</Text>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Title level={5}>Tổng cộng:</Title>
              <Title level={5} type="danger">{order.totalPrice?.toLocaleString()}đ</Title>
            </Row>

            {/* --- NÚT ADMIN: XÁC NHẬN ĐÃ THANH TOÁN --- */}
            {user && user.isAdmin && !order.isPaid && (
              <Button 
                type="default" 
                block 
                size="large" 
                style={{ marginTop: 20, borderColor: '#389e0d', color: '#389e0d' }}
                onClick={payHandler}
              >
                Xác nhận Đã Thu Tiền
              </Button>
            )}

            {/* --- NÚT ADMIN: XÁC NHẬN GIAO HÀNG --- */}
            {user && user.isAdmin && !order.isDelivered && (
              <Button 
                type="primary" 
                block 
                size="large" 
                style={{ marginTop: 10 }}
                loading={loadingDeliver}
                onClick={deliverHandler}
              >
                Xác nhận Đã Giao Hàng
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;