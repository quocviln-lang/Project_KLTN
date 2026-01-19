import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Row, Col, Image, List, Card, Button, Typography, Divider, Rate, Radio, message, Spin, Space, Breadcrumb, Empty, InputNumber, Tabs, Avatar, Tag, Modal, Input } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, ThunderboltFilled, SafetyCertificateFilled, UserOutlined, RobotOutlined, CheckCircleFilled, EditOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State biến thể & Số lượng
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMemory, setSelectedMemory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [qty, setQty] = useState(1);

  // State Modal Đánh giá
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // 1. Dùng useCallback để "đóng băng" hàm này, tránh tạo lại mỗi lần render
  const fetchProductData = useCallback(async () => {
      try {
        setLoading(true);
        // Lấy chi tiết sản phẩm
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        
        // Setup mặc định
        if (data.variants && data.variants.length > 0) {
           const firstVar = data.variants[0];
           setSelectedColor(firstVar.color || '');
           setSelectedMemory(firstVar.memory || '');
           setSelectedPrice(firstVar.price || 0);
        } else {
           setSelectedPrice(data.price || 0);
        }

        // Logic AI Gợi ý
        try {
            const res = await axios.get('/api/products');
            const allProducts = res.data || [];
            let recommendations = [];

            if (data.category === 'Smartphones') {
                recommendations = allProducts.filter(p => 
                    (p.category === 'Accessories' || p.category === 'Chargers' || p.category === 'Headphones') && 
                    p.brand === data.brand && 
                    p._id !== data._id
                );
            } else {
                recommendations = allProducts.filter(p => 
                    p.category === data.category && 
                    p._id !== data._id
                );
            }
            
            if (recommendations.length === 0) {
                recommendations = allProducts.filter(p => p._id !== data._id).slice(0, 4);
            }

            setRelatedProducts(recommendations.slice(0, 4));
        } catch (err) {
            console.error("Lỗi logic gợi ý:", err);
        }

        setLoading(false);

      } catch (error) {
        console.error(error);
        setLoading(false);
      }
  }, [id]); // Hàm này chỉ được tạo lại khi ID thay đổi

  // 2. useEffect giờ chỉ phụ thuộc vào hàm fetchProductData (đã ổn định nhờ useCallback)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchProductData();
      }
    };

    loadData();

    return () => {
      isMounted = false;    
    };
  }, [fetchProductData]);

  // Xử lý biến thể 
  const handleVariantChange = (color, memory) => {
      setSelectedColor(color);
      setSelectedMemory(memory);
      
      if (product && product.variants) {
          const variant = product.variants.find(v => v.color === color && v.memory === memory);
          if (variant) {
              setSelectedPrice(variant.price || 0);
          }
      }
  };

  const handleAddToCart = () => {
      if(!product) return;
      if(product.countInStock === 0) {
          message.warning('Sản phẩm tạm hết hàng');
          return;
      }
      
      addToCart({
          ...product,
          product: product._id,
          image: product.image || product.thumbnail,
          qty: Number(qty),
          color: selectedColor || 'Tiêu chuẩn',
          memory: selectedMemory || 'Tiêu chuẩn',
          price: Number(selectedPrice)
      });
      message.success(`Đã thêm ${qty} sản phẩm vào giỏ!`);
  };

  // 3. Xử lý Gửi Đánh Giá
  const submitReviewHandler = async () => {
      if (!user) {
          message.error('Vui lòng đăng nhập để viết đánh giá');
          navigate('/login');
          return;
      }

      if (comment.trim() === '') {
          message.error('Vui lòng nhập nội dung đánh giá');
          return;
      }

      setSubmitLoading(true);
      try {
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`,
              },
          };

          await axios.post(
              `/api/products/${id}/reviews`,
              { rating, comment },
              config
          );

          message.success('Cảm ơn bạn đã đánh giá!');
          setSubmitLoading(false);
          setIsModalOpen(false);
          setComment('');
          setRating(5);
          
          // 4. Gọi trực tiếp hàm này để reload lại dữ liệu (Bình luận mới sẽ hiện ra ngay)
          fetchProductData();

      } catch (error) {
          setSubmitLoading(false);
          message.error(error.response?.data?.message || 'Bạn đã đánh giá sản phẩm này rồi');
      }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" tip="Đang tải..." /></div>;
  if (!product) return <Empty description="Không tìm thấy sản phẩm" style={{ marginTop: 50 }} />;

  const itemsTab = [
    {
      key: '1',
      label: <span style={{ fontSize: 16, fontWeight: 600 }}>Mô tả chi tiết</span>,
      children: (
        <div style={{ padding: 20 }}>
            <Paragraph style={{ fontSize: 16, lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {product.description || 'Đang cập nhật mô tả...'}
            </Paragraph>
        </div>
      ),
    },
    {
      key: '2',
      label: <span style={{ fontSize: 16, fontWeight: 600 }}>Đánh giá & Nhận xét ({product.reviews?.length || 0})</span>,
      children: (
        <div style={{ padding: 20 }}>
             <List
                itemLayout="horizontal"
                dataSource={product.reviews || []}
                locale={{ emptyText: 'Chưa có đánh giá nào. Hãy là người đầu tiên!' }}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                      title={<Space><Text strong>{item.name}</Text><Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} /></Space>}
                      description={
                          <div>
                              <div style={{ color: '#555', marginTop: 5 }}>{item.comment}</div>
                              <div style={{ fontSize: 11, color: '#999', marginTop: 5 }}>
                                  {item.createdAt ? dayjs(item.createdAt).format('DD/MM/YYYY HH:mm') : 'Vừa xong'}
                              </div>
                          </div>
                      }
                    />
                  </List.Item>
                )}
             />
             
             <Divider />
             
             {user ? (
                <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => setIsModalOpen(true)}
                    style={{ width: 200 }}
                >
                    Viết đánh giá
                </Button>
             ) : (
                <div style={{ background: '#fffbe6', padding: 15, border: '1px solid #ffe58f', borderRadius: 5 }}>
                    <Text>Vui lòng <Link to="/login">đăng nhập</Link> để viết đánh giá.</Text>
                </div>
             )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Breadcrumb style={{ marginBottom: 20 }}>
         <Breadcrumb.Item><Link to="/"><HomeOutlined /></Link></Breadcrumb.Item>
         <Breadcrumb.Item>{product.category}</Breadcrumb.Item>
         <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={10}>
            <div style={{ padding: 20, border: '1px solid #f0f0f0', borderRadius: 8, textAlign: 'center' }}>
               <Image 
                 src={product.image || product.thumbnail || 'https://via.placeholder.com/400'} 
                 width={'100%'} 
                 style={{ maxHeight: 400, objectFit: 'contain' }} 
               />
            </div>
          </Col>

          <Col xs={24} md={14}>
            <Title level={2} style={{ marginBottom: 5 }}>{product.name}</Title>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
               <Rate disabled defaultValue={product.rating || 0} allowHalf /> 
               <Text type="secondary">({product.numReviews || 0} đánh giá)</Text>
               <Tag color="success"><CheckCircleFilled /> Còn hàng</Tag>
            </div>

            <Title level={1} type="danger" style={{ margin: '0 0 20px 0', color: '#cf1322' }}>
                {(selectedPrice || 0).toLocaleString()}đ
            </Title>
            
            {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: 20, background: '#fafafa', padding: 15, borderRadius: 8 }}>
                    <div style={{ marginBottom: 10 }}><Text strong>Màu sắc:</Text></div>
                    <Radio.Group 
                        value={selectedColor} 
                        onChange={e => handleVariantChange(e.target.value, selectedMemory)}
                        buttonStyle="solid"
                    >
                        {[...new Set(product.variants.map(v => v.color))].map(c => (
                            <Radio.Button key={c} value={c}>{c}</Radio.Button>
                        ))}
                    </Radio.Group>
                    
                    <div style={{ margin: '15px 0 10px' }}><Text strong>Bộ nhớ:</Text></div>
                    <Radio.Group 
                        value={selectedMemory} 
                        onChange={e => handleVariantChange(selectedColor, e.target.value)}
                        buttonStyle="solid"
                    >
                        {[...new Set(product.variants.map(v => v.memory))].map(m => (
                             <Radio.Button key={m} value={m}>{m}</Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            )}

            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 30 }}>
                <Space>
                    <Text strong>Số lượng:</Text>
                    <InputNumber 
                        min={1} 
                        max={product.countInStock || 10} 
                        value={qty} 
                        onChange={(val) => setQty(val)} 
                        size="large"
                    />
                </Space>

                <Button 
                    type="primary" 
                    size="large" 
                    icon={<ShoppingCartOutlined />} 
                    style={{ height: 50, fontSize: 18, width: '100%', maxWidth: 300 }}
                    onClick={handleAddToCart}
                    disabled={!product.countInStock || product.countInStock === 0}
                >
                    {(product.countInStock && product.countInStock > 0) ? 'THÊM VÀO GIỎ' : 'TẠM HẾT HÀNG'}
                </Button>
            </div>
            
            <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Space direction="vertical" size={2}>
                    <Text type="success"><SafetyCertificateFilled /> Hàng chính hãng 100% - Bảo hành 12 tháng</Text>
                    <Text type="success"><ThunderboltFilled /> Giao hàng nhanh 2h (Nội thành)</Text>
                </Space>
            </Card>

            {product.specs && (
                <div style={{ marginTop: 20 }}>
                    <Title level={5}>Thông số kỹ thuật</Title>
                    <List size="small" bordered dataSource={[
                        { label: 'Màn hình', val: product.specs.screen },
                        { label: 'Chip', val: product.specs.cpu },
                        { label: 'RAM', val: product.specs.ram },
                        { label: 'Pin', val: product.specs.battery },
                    ].filter(x => x.val)} renderItem={item => (
                        <List.Item>
                             <Text type="secondary" style={{ width: 100, display: 'inline-block' }}>{item.label}:</Text> 
                             <Text strong>{item.val}</Text>
                        </List.Item>
                    )} />
                </div>
            )}
          </Col>
        </Row>

        <div style={{ marginTop: 40 }}>
            <Tabs defaultActiveKey="1" items={itemsTab} size="large" />
        </div>
      </Card>

      {relatedProducts.length > 0 && (
          <div style={{ marginTop: 50 }}>
              <Divider orientation="left">
                  <Space>
                      <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                      <Title level={3} style={{ margin: 0 }}>
                          AI Gợi ý cho bạn
                      </Title>
                  </Space>
              </Divider>
              
              <Row gutter={[16, 16]}>
                  {relatedProducts.map((item) => (
                      <Col key={item._id} xs={12} sm={6} md={6}>
                          <Link to={`/product/${item._id}`}>
                              <Card 
                                  hoverable 
                                  cover={
                                    <div style={{ padding: 15, textAlign: 'center' }}>
                                        <img 
                                            alt={item.name} 
                                            src={item.image || item.thumbnail} 
                                            style={{ height: 150, objectFit: 'contain' }} 
                                        />
                                    </div>
                                  }
                              >
                                  <Card.Meta 
                                    title={<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>}
                                    description={<Text type="danger" strong>{(item.price || 0).toLocaleString()}đ</Text>}
                                  />
                              </Card>
                          </Link>
                      </Col>
                  ))}
              </Row>
          </div>
      )}

      <Modal
        title="Đánh giá sản phẩm"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={submitReviewHandler}
        confirmLoading={submitLoading}
        okText="Gửi đánh giá"
        cancelText="Hủy"
      >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ marginBottom: 10 }}>Bạn cảm thấy sản phẩm thế nào?</div>
              <Rate value={rating} onChange={setRating} style={{ fontSize: 30 }} />
          </div>
          <div>
              <div style={{ marginBottom: 5 }}>Viết nhận xét của bạn:</div>
              <TextArea 
                rows={4} 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." 
              />
          </div>
      </Modal>

    </div>
  );
};

export default ProductPage;