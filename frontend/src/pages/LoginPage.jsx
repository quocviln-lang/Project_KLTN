import React, { useContext, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const { Title } = Typography;

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem nên chuyển hướng về đâu sau khi login (mặc định là về trang chủ)
  // Ví dụ: Đang ở giỏ hàng bấm thanh toán -> login -> quay lại trang shipping
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  // Nếu đã đăng nhập rồi thì đá về trang chủ luôn, không cho ở trang login nữa
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  // Xử lý khi bấm nút Đăng nhập
  const onFinish = async (values) => {
    const success = await login(values.email, values.password);
    if (success) {
      navigate(redirect);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh', background: '#f0f2f5' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Title level={2}>Đăng Nhập</Title>
            <p>Chào mừng bạn quay trở lại PhoneShop</p>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            {/* Input Email */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            {/* Input Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            {/* Nút Submit */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ height: 45, fontSize: 16 }}>
                Đăng Nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;