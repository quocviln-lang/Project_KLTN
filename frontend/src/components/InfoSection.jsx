import React from 'react';
import { Row, Col, Typography } from 'antd';
import { SafetyCertificateOutlined, CarOutlined, UndoOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const items = [
  { icon: <SafetyCertificateOutlined />, title: 'Hàng Chính Hãng', desc: '100% authentic items' },
  { icon: <CarOutlined />, title: 'Giao Nhanh', desc: 'Freeship đơn > 500k' },
  { icon: <UndoOutlined />, title: 'Bảo Hành 1 Năm', desc: 'Lỗi 1 đổi 1 trong 30 ngày' },
  { icon: <CustomerServiceOutlined />, title: 'Hỗ Trợ 24/7', desc: 'Luôn sẵn sàng hỗ trợ bạn' },
];

const InfoSection = () => {
  return (
    <div style={{ marginTop: '60px', padding: '40px 0', borderTop: '1px solid #eee' }}>
      <Row gutter={[32, 32]} justify="center">
        {items.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '30px', color: '#1890ff', marginBottom: '10px' }}>{item.icon}</div>
            <Title level={5} style={{ marginBottom: '5px' }}>{item.title}</Title>
            <Text type="secondary">{item.desc}</Text>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default InfoSection;