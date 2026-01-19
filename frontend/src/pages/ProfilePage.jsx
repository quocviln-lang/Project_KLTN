import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Row, Col, Card, Avatar, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, SaveOutlined, MailOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { user, login } = useContext(AuthContext); // Dùng hàm login để cập nhật lại context sau khi update
  
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Điền dữ liệu cũ vào Form
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Gửi request cập nhật
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        config
      );

      message.success('Cập nhật hồ sơ thành công!');
      
      // Cập nhật lại Auth Context và LocalStorage với thông tin mới
      // Giả sử API trả về user mới update kèm token cũ (hoặc mới)
      // Ở đây ta login lại bằng data mới để refresh giao diện
      login(data); 

      setLoading(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi cập nhật hồ sơ');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <Row gutter={[40, 40]} align="middle">
        
        {/* CỘT TRÁI: AVATAR & GIỚI THIỆU */}
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar 
                size={120} 
                style={{ backgroundColor: '#1890ff', fontSize: 48, marginBottom: 20 }}
                icon={<UserOutlined />}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <Title level={4}>{user?.name}</Title>
            <Text type="secondary">{user?.email}</Text>
            <div style={{ marginTop: 20 }}>
              <Text strong type="success">Thành viên chính thức</Text>
            </div>
          </Card>
        </Col>

        {/* CỘT PHẢI: FORM CẬP NHẬT */}
        <Col xs={24} md={16}>
          <Card 
            title="Cập nhật thông tin" 
            style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: 'none' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>

              <Form.Item label="Địa chỉ Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} size="large" disabled /> 
                {/* Email thường không cho sửa hoặc cần quy trình riêng, ở đây ta cứ disable cho an toàn */}
              </Form.Item>

              <Form.Item label="Đổi mật khẩu mới" name="password" help="Để trống nếu không muốn đổi">
                <Input.Password prefix={<LockOutlined />} size="large" placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item 
                label="Xác nhận mật khẩu" 
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      if (!getFieldValue('password')) return Promise.resolve(); // Nếu pass trống thì confirm cũng ko bắt buộc
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} size="large" placeholder="Nhập lại mật khẩu" />
              </Form.Item>

              <Form.Item style={{ marginTop: 20 }}>
                <Button type="primary" htmlType="submit" size="large" block icon={<SaveOutlined />} loading={loading}>
                  LƯU THAY ĐỔI
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;