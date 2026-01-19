import React, { useState, useEffect, useMemo } from 'react'; // 1. Import useMemo
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Card, Checkbox, Slider, Typography, Empty, Spin, Breadcrumb, Rate, Tag } from 'antd';
import { HomeOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BRANDS } from '../utils/constants';

const { Title, Text } = Typography;
const { Meta } = Card;

const CategoryPage = () => {
  const { slug } = useParams();
  
  const [products, setProducts] = useState([]); // Chỉ cần giữ state danh sách gốc
  const [loading, setLoading] = useState(true);

  // State bộ lọc
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000000]);

  // 1. Lấy dữ liệu khi vào trang (hoặc khi đổi danh mục)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        
        // Lọc sơ bộ theo danh mục (slug)
        const categoryProducts = data.filter(p => p.category === slug);
        setProducts(categoryProducts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
    
    // Reset bộ lọc (Dùng setTimeout để tránh lỗi update state khi đang render)
    setTimeout(() => {
      setSelectedBrands([]);
      setPriceRange([0, 50000000]);
    }, 0);

  }, [slug]);

  // 2. TỐI ƯU HÓA: Dùng useMemo thay vì useEffect để lọc sản phẩm
  // React sẽ tự động tính toán lại 'filteredProducts' chỉ khi các biến phụ thuộc thay đổi
  const filteredProducts = useMemo(() => {
    let result = products;

    // Lọc Thương hiệu
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Lọc Giá
    result = result.filter(p => {
        const price = p.price || (p.variants && p.variants[0]?.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
    });

    return result;
  }, [products, selectedBrands, priceRange]);

  // Xử lý tick chọn Brand
  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item><Link to="/"><HomeOutlined /></Link></Breadcrumb.Item>
        <Breadcrumb.Item>{slug}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={32}>
        {/* CỘT TRÁI: BỘ LỌC */}
        <Col xs={24} md={6}>
          <Card title={<><FilterOutlined /> Bộ lọc tìm kiếm</>} style={{ width: '100%', marginBottom: 20 }}>
            
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Thương hiệu</Title>
              <Checkbox.Group 
                options={BRANDS} 
                value={selectedBrands} 
                onChange={handleBrandChange} 
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Title level={5}>Khoảng giá</Title>
              <Slider 
                range 
                min={0} 
                max={50000000} 
                step={1000000}
                value={priceRange} 
                onChange={(value) => setPriceRange(value)} 
                trackStyle={[{ backgroundColor: '#1890ff' }]}
                handleStyle={[{ borderColor: '#1890ff' }, { borderColor: '#1890ff' }]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <Text>{priceRange[0].toLocaleString()}đ</Text>
                <Text>{priceRange[1].toLocaleString()}đ</Text>
              </div>
            </div>

          </Card>
        </Col>

        {/* CỘT PHẢI: KẾT QUẢ */}
        <Col xs={24} md={18}>
            <div style={{ marginBottom: 20 }}>
                <Title level={3} style={{ margin: 0 }}>{slug} ({filteredProducts.length} sản phẩm)</Title>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>
            ) : filteredProducts.length === 0 ? (
                <Empty description="Không tìm thấy sản phẩm phù hợp tiêu chí lọc" />
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredProducts.map((product) => (
                        <Col key={product._id} xs={24} sm={12} lg={8}>
                            <Link to={`/product/${product._id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <div style={{ padding: 20, textAlign: 'center', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img 
                                              alt={product.name} 
                                              src={product.thumbnail || product.image} 
                                              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                                            />
                                        </div>
                                    }
                                >
                                    <Meta 
                                        title={<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>}
                                        description={
                                            <div>
                                                <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16, margin: '5px 0' }}>
                                                    {product.price?.toLocaleString() || product.variants?.[0]?.price?.toLocaleString()}đ
                                                </div>
                                                <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                                                <div style={{ marginTop: 8 }}>
                                                    <Tag>{product.brand}</Tag>
                                                </div>
                                            </div>
                                        } 
                                    />
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </Col>
      </Row>
    </div>
  );
};

export default CategoryPage;