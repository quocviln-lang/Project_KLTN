import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Card, Statistic, message, Spin } from 'antd';
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.get('/api/orders/dashboard', config);
        setStats(data);

        // Xử lý dữ liệu cho biểu đồ: Gom nhóm doanh thu theo ngày
        // data.orders là mảng các đơn hàng. Ta cần map về dạng: { name: '20/10', total: 5000000 }
        const processedData = processChartData(data.orders);
        setChartData(processedData);

        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error('Lỗi tải thống kê');
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchStats();
    }
  }, [user]);

  // Hàm phụ trợ: Nhóm đơn hàng theo ngày để vẽ biểu đồ
  const processChartData = (orders) => {
    const map = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('vi-VN').slice(0, 5); // Lấy ngày/tháng (VD: 18/01)
      if (map[date]) {
        map[date] += order.totalPrice;
      } else {
        map[date] = order.totalPrice;
      }
    });

    // Chuyển object thành mảng cho Recharts dùng
    return Object.keys(map).map((key) => ({
      name: key,
      DoanhThu: map[key],
    }));
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '30px', maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 30 }}>Tổng Quan Hệ Thống</h2>

      {/* 4 THẺ THỐNG KÊ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#e6f7ff' }}>
            <Statistic
              title="Tổng Doanh Thu"
              value={stats?.totalRevenue}
              precision={0}
              valueStyle={{ color: '#096dd9', fontWeight: 'bold' }}
              prefix={<DollarCircleOutlined />}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#f6ffed' }}>
            <Statistic
              title="Tổng Đơn Hàng"
              value={stats?.ordersCount}
              valueStyle={{ color: '#389e0d', fontWeight: 'bold' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#fff7e6' }}>
            <Statistic
              title="Tổng Sản Phẩm"
              value={stats?.productsCount}
              valueStyle={{ color: '#d46b08', fontWeight: 'bold' }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ background: '#fff0f6' }}>
            <Statistic
              title="Tổng Khách Hàng"
              value={stats?.usersCount}
              valueStyle={{ color: '#c41d7f', fontWeight: 'bold' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* BIỂU ĐỒ DOANH THU */}
      <Card title="Biểu đồ doanh thu theo ngày" style={{ marginTop: 30, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
              <Area 
                type="monotone" 
                dataKey="DoanhThu" 
                stroke="#1890ff" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;