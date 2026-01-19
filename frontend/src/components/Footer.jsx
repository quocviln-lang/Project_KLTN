import React from 'react';
import { Row, Col, Typography, Input, Button, Divider } from 'antd';
import { FacebookFilled, InstagramFilled, YoutubeFilled, SendOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <div style={{ background: '#001529', color: '#fff', padding: '60px 0 20px', marginTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[40, 40]}>
          {/* CỘT 1: GIỚI THIỆU */}
          <Col xs={24} md={8}>
            <Title level={3} style={{ color: '#fff' }}>TECHSHOP</Title>
            <Text style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 20 }}>
              Hệ thống bán lẻ điện thoại và phụ kiện chính hãng uy tín hàng đầu. Cam kết chất lượng, giá cả cạnh tranh và dịch vụ hậu mãi tận tâm.
            </Text>
            <div style={{ display: 'flex', gap: 15 }}>
              <FacebookFilled style={{ fontSize: 24, color: '#fff', cursor: 'pointer' }} />
              <InstagramFilled style={{ fontSize: 24, color: '#fff', cursor: 'pointer' }} />
              <YoutubeFilled style={{ fontSize: 24, color: '#fff', cursor: 'pointer' }} />
            </div>
          </Col>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff' }}>Hỗ Trợ Khách Hàng</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link style={{ color: 'rgba(255,255,255,0.65)' }}>Hướng dẫn mua hàng</Link>
              <Link style={{ color: 'rgba(255,255,255,0.65)' }}>Chính sách bảo hành</Link>
              <Link style={{ color: 'rgba(255,255,255,0.65)' }}>Vận chuyển & Giao nhận</Link>
              <Link style={{ color: 'rgba(255,255,255,0.65)' }}>Đổi trả hàng</Link>
              <Link style={{ color: 'rgba(255,255,255,0.65)' }}>Bảo mật thông tin</Link>
            </div>
          </Col>

          {/* CỘT 3: ĐĂNG KÝ NHẬN TIN */}
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: '#fff' }}>Đăng Ký Nhận Tin</Title>
            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>Nhận thông tin khuyến mãi mới nhất</Text>
            <div style={{ display: 'flex', marginTop: 15 }}>
              <Input placeholder="Email của bạn..." style={{ borderRadius: '4px 0 0 4px' }} />
              <Button type="primary" icon={<SendOutlined />} style={{ borderRadius: '0 4px 4px 0' }}>Gửi</Button>
            </div>
            <div style={{ marginTop: 20 }}>
               <Text style={{ color: 'rgba(255,255,255,0.65)', display: 'block' }}>Hotline: 1900 1234</Text>
               <Text style={{ color: 'rgba(255,255,255,0.65)', display: 'block' }}>Email: support@techshop.com</Text>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
          Copyright © 2026 TechShop KLTN. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;