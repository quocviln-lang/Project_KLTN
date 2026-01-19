import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Rate, Typography, Spin, Button, Empty } from 'antd';
import { ShoppingCartOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import HeroSlider from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';
import InfoSection from '../components/InfoSection';

const { Title } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { keyword } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = keyword ? `/api/products?keyword=${keyword}` : '/api/products';
        const { data } = await axios.get(url);
        // Ở trang chủ, ta chỉ lấy tối đa 8 sản phẩm mới nhất thôi cho gọn
        setProducts(keyword ? data : data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      
      {/* 1. Banner & Danh mục (Chỉ hiện khi không tìm kiếm) */}
      {!keyword && <HeroSlider />}
      {!keyword && <CategorySection />}

      {/* 2. Danh sách sản phẩm nổi bật / Kết quả tìm kiếm */}
      <div style={{ marginTop: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Title level={3} style={{ margin: 0 }}>
            {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Sản Phẩm Mới Nhất'}
          </Title>
          {/* Nếu muốn xem thêm thì bấm vào đây (hoặc link sang trang Tất cả sản phẩm nếu có) */}
          {!keyword && <Button type="link">Xem tất cả <RightOutlined /></Button>}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
        ) : (
          <>
            {products.length === 0 ? (
              <Empty description="Không tìm thấy sản phẩm nào" />
            ) : (
              <Row gutter={[24, 24]}>
                {products.map((product) => (
                  <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                    <Link to={`/product/${product._id}`}>
                      <Card
                        hoverable
                        style={{ borderRadius: '10px', overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        bodyStyle={{ padding: '15px' }}
                        cover={
                          <div style={{ padding: '20px', background: '#f9f9f9', display: 'flex', justifyContent: 'center' }}>
                             <img 
                                alt={product.name} 
                                src={product.thumbnail || product.image} 
                                style={{ height: '180px', objectFit: 'contain' }} 
                             />
                          </div>
                        }
                      >
                         <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 5, height: 44, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {product.name}
                         </div>
                         <div style={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}>
                            {product.price?.toLocaleString()}đ
                         </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </div>

      {/* 3. Footer info */}
      <InfoSection />
    </div>
  );
};

export default HomePage;