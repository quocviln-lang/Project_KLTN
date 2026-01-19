import React, { useEffect, useState, useContext } from 'react';
import { Table, Tag, Button, Card, Typography, Space, Spin, message, Breadcrumb } from 'antd';
import { EyeOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const { Title } = Typography;

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Lấy danh sách đơn hàng của tôi
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error('Không thể tải lịch sử đơn hàng');
        setLoading(false);
      }
    };

    if (!user) {
      navigate('/login');
    } else {
      fetchMyOrders();
    }
  }, [user, navigate]);

  // 2. Cấu hình cột cho bảng
  const columns = [
    {
      title: 'Mã đơn hàng (ID)',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <Link to={`/order/${text}`} style={{ fontWeight: 'bold' }}>{text.substring(0, 10)}...</Link>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => <span style={{ color: '#cf1322', fontWeight: 600 }}>{price?.toLocaleString()}đ</span>,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (isPaid) => (
        <Tag color={isPaid ? 'success' : 'warning'}>
          {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </Tag>
      ),
    },
    {
      title: 'Vận chuyển',
      dataIndex: 'isDelivered',
      key: 'isDelivered',
      render: (isDelivered) => (
        <Tag color={isDelivered ? 'processing' : 'default'}>
          {isDelivered ? 'Đã giao hàng' : 'Đang xử lý'}
        </Tag>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_, record) => (
        <Link to={`/order/${record._id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            Xem
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item>Đơn mua của tôi</Breadcrumb.Item>
      </Breadcrumb>

      <Card 
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        title={
          <Space>
            <ShoppingOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <span style={{ fontSize: 18 }}>Lịch sử đơn hàng</span>
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
        ) : (
          <Table 
            dataSource={orders} 
            columns={columns} 
            rowKey="_id"
            pagination={{ pageSize: 5 }} 
            locale={{ emptyText: 'Bạn chưa mua đơn hàng nào' }}
          />
        )}
      </Card>
    </div>
  );
};

export default MyOrdersPage;