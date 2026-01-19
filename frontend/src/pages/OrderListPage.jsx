import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, message, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons'; // Icon con mắt để xem chi tiết
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      // Gọi API lấy tất cả đơn
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
        console.error(error);
      message.error('Lỗi tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã đơn (ID)',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <span>...{text.substring(20, 24)}</span>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (user && user.name) ? user.name : 'Khách đã xóa',
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
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (isPaid) => (
        isPaid 
        ? <Tag color="green">Đã trả</Tag> 
        : <Tag color="red">Chưa trả</Tag>
      ),
    },
    {
      title: 'Giao hàng',
      dataIndex: 'isDelivered',
      key: 'isDelivered',
      render: (isDelivered) => (
        isDelivered 
        ? <Tag color="green">Đã giao</Tag> 
        : <Tag color="orange">Chưa giao</Tag>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          icon={<EyeOutlined />}
          // Bấm vào thì chuyển sang trang chi tiết đơn hàng (Sẽ làm ở bước sau)
          onClick={() => navigate(`/order/${record._id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '30px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Quản Lý Đơn Hàng</h2>
      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="_id" 
        loading={loading}
        bordered
      />
    </div>
  );
};

export default OrderListPage;