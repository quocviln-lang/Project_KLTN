import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, InputNumber, Button, Select, Upload, message, Card, Row, Col, Space, Divider, Spin, Image } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { CATEGORIES, BRANDS, COLORS, MEMORY_OPTIONS } from '../utils/constants';

const { Option } = Select;
const { TextArea } = Input;

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploading, setUploading] = useState(false); // State loading cho upload ảnh
  
  const [imageUrl, setImageUrl] = useState(''); 
  const [isSmartphone, setIsSmartphone] = useState(false);

  // 1. Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        
        form.setFieldsValue({
          name: data.name,
          price: data.price,
          image: data.image,
          brand: data.brand,
          category: data.category,
          countInStock: data.countInStock,
          description: data.description,
          specs: data.specs || {},
          variants: data.variants || [],
        });

        setImageUrl(data.image);
        setIsSmartphone(data.category === 'Smartphones');
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error('Lỗi tải sản phẩm');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, form]);

  // 2. Xử lý Upload Ảnh (Gọi API Backend)
  const uploadFileHandler = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('image', file); // 'image' phải khớp với key trong uploadRoutes backend

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Gọi API Upload của Backend
      const { data } = await axios.post('/api/upload', formData, config);

      setImageUrl(data); // Backend trả về đường dẫn ảnh (VD: /uploads/image-123.jpg hoặc link Cloudinary)
      form.setFieldsValue({ image: data }); // Tự điền vào ô Input
      
      message.success('Upload ảnh thành công!');
      setUploading(false);
      onSuccess("Ok");
    } catch (error) {
      console.error(error);
      message.error('Lỗi upload ảnh');
      setUploading(false);
      onError({ error });
    }
  };

  const handleCategoryChange = (value) => {
    setIsSmartphone(value === 'Smartphones');
  };

  const onFinish = async (values) => {
    setLoadingUpdate(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const productData = {
        ...values,
        image: imageUrl || values.image,
        thumbnail: imageUrl || values.image, // Tạm thời dùng chung ảnh
      };

      await axios.put(`/api/products/${id}`, productData, config);
      message.success('Cập nhật thành công!');
      navigate('/admin/products');
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi cập nhật');
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '20px', maxWidth: 1000, margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/products')} style={{ marginBottom: 20 }}>
        Quay lại
      </Button>

      <Card title={`Chỉnh sửa sản phẩm: ${id}`}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ variants: [{}] }}
        >
          <Row gutter={24}>
            {/* CỘT TRÁI */}
            <Col span={12}>
              <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Giá (VNĐ)" name="price" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tồn kho" name="countInStock" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Danh mục" name="category" rules={[{ required: true }]}>
                    <Select onChange={handleCategoryChange}>
                      {/* Lấy từ constants để đảm bảo khớp chính xác */}
                      {CATEGORIES.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thương hiệu" name="brand" rules={[{ required: true }]}>
                     <Select showSearch>
                      {BRANDS.map(b => <Option key={b} value={b}>{b}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              {/* --- PHẦN UPLOAD ẢNH MỚI --- */}
              <Form.Item label="Hình ảnh" name="image">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Ô nhập link thủ công (nếu muốn) */}
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Nhập link hoặc upload" />
                  
                  {/* Nút Upload File */}
                  <Upload 
                    customRequest={uploadFileHandler} 
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />} loading={uploading}>
                      {uploading ? 'Đang tải lên...' : 'Chọn ảnh từ máy tính'}
                    </Button>
                  </Upload>

                  {/* Xem trước ảnh */}
                  {imageUrl && (
                    <Image 
                      src={imageUrl} 
                      alt="Preview" 
                      height={100} 
                      style={{ objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4, padding: 5 }} 
                    />
                  )}
                </div>
              </Form.Item>
              {/* --------------------------- */}

              <Form.Item label="Mô tả" name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>

            {/* CỘT PHẢI: GIỮ NGUYÊN CODE CŨ */}
            <Col span={12}>
              {isSmartphone && (
                <Card type="inner" title="Cấu hình (Specs)" style={{ marginBottom: 20, background: '#f9f9f9' }}>
                  <Form.Item label="Màn hình" name={['specs', 'screen']}><Input /></Form.Item>
                  <Form.Item label="CPU" name={['specs', 'cpu']}><Input /></Form.Item>
                  <Form.Item label="RAM" name={['specs', 'ram']}><Input /></Form.Item>
                  <Form.Item label="Pin" name={['specs', 'battery']}><Input /></Form.Item>
                </Card>
              )}

              <Card type="inner" title="Phiên bản (Màu/ROM)" style={{ background: '#f0f5ff' }}>
                <Form.List name="variants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                          <Form.Item {...restField} name={[name, 'color']} rules={[{ required: true }]} style={{ width: 100 }}>
                             <Select placeholder="Màu">{COLORS.map(c => <Option key={c} value={c}>{c}</Option>)}</Select>
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'memory']} rules={[{ required: true }]} style={{ width: 90 }}>
                             <Select placeholder="GB">{MEMORY_OPTIONS.map(m => <Option key={m} value={m}>{m}</Option>)}</Select>
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'price']} rules={[{ required: true }]}>
                            <InputNumber placeholder="Giá" style={{ width: 110 }} formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm bản</Button>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>
          </Row>

          <Divider />
          <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={loadingUpdate} block>
            CẬP NHẬT SẢN PHẨM
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ProductEditPage;