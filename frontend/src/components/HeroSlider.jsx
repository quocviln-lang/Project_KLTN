import React from 'react';
import { Carousel, Button, Typography, Row, Col } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const slides = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    desc: "Thiết kế Titan. Chip A17 Pro. Camera 48MP. Đỉnh cao công nghệ.",
    image: "https://cdn.tgdd.vn/2023/09/banner/iphone-15-promax-2880-800-1920x533.png", // Ảnh minh họa
    link: "/search/iphone",
    color: "#000" // Màu chữ
  },
  {
    id: 2,
    title: "Galaxy S24 Ultra",
    desc: "Quyền năng Galaxy AI. Zoom mắt thần bóng đêm. Hiệu năng vô cực.",
    image: "https://images.samsung.com/is/image/samsung/assets/vn/home/2024/S24_Ultra_PC_1440x640.jpg",
    link: "/search/samsung",
    color: "#fff"
  },
  {
    id: 3,
    title: "Phụ Kiện Chính Hãng",
    desc: "Nâng tầm trải nghiệm. Ốp lưng, sạc nhanh, tai nghe chất lượng cao.",
    image: "https://cdn.tgdd.vn/2023/11/banner/phu-kien-apple-2880-800-1920x533.png",
    link: "/category/accessory",
    color: "#000"
  }
];

const HeroSlider = () => {
  return (
    <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Carousel autoplay effect="fade">
        {slides.map((slide) => (
          <div key={slide.id}>
            <div 
              style={{ 
                height: '400px', 
                backgroundImage: `url(${slide.image})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              {/* Lớp phủ mờ để chữ dễ đọc hơn nếu ảnh quá sáng */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)' }}></div>
              
              <Row align="middle" style={{ height: '100%', position: 'relative', zIndex: 1 }}>
                <Col span={12} offset={2}>
                  <Title style={{ color: '#fff', fontSize: '3rem', marginBottom: 10 }}>{slide.title}</Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: 500 }}>
                    {slide.desc}
                  </Paragraph>
                  <Link to={slide.link}>
                    <Button type="primary" size="large" shape="round" icon={<RightOutlined />} style={{ height: 50, padding: '0 40px', fontSize: 16, marginTop: 20 }}>
                      Mua Ngay
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSlider;