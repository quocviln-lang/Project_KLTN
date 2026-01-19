import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { MobileOutlined, LaptopOutlined, CustomerServiceOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Title } = Typography;

const categories = [
  { id: 1, name: 'Smartphones', icon: <MobileOutlined />, color: '#e6f7ff', route: 'Smartphones' },
  { id: 2, name: 'Headphones', icon: <CustomerServiceOutlined />, color: '#fff7e6', route: 'Headphones' },
  { id: 3, name: 'Chargers', icon: <ThunderboltOutlined />, color: '#f6ffed', route: 'Chargers' },
  { id: 4, name: 'Accessories', icon: <LaptopOutlined />, color: '#fff0f6', route: 'Accessories' },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: 40 }}>
      <Title level={3}>Danh Mục Sản Phẩm</Title>
      <Row gutter={[16, 16]}>
        {categories.map((cat) => (
          <Col xs={12} sm={6} key={cat.id}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', background: cat.color, border: 'none' }}
              // Bấm vào thì chuyển hướng sang trang CategoryPage
              onClick={() => navigate(`/category/${cat.route}`)}
            >
              <div style={{ fontSize: 32, color: '#001529', marginBottom: 10 }}>
                {cat.icon}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{cat.name}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySection;