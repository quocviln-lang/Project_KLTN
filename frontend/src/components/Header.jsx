import React, { useContext } from 'react';
import { Layout, Badge, Dropdown, Button, Avatar, Space, Typography } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  HistoryOutlined, 
  ProfileOutlined,
  DashboardOutlined,
  UsergroupAddOutlined, // Icon quản lý User
  BarcodeOutlined,      // Icon quản lý Sản phẩm
  OrderedListOutlined,  // Icon quản lý Đơn hàng
  AppstoreOutlined,
  GiftOutlined      // Icon menu tổng quan Dashboard
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import SearchBox from './SearchBox';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Dùng Context hoặc lấy tạm từ LocalStorage nếu chưa xong Context
  const { cartItems } = useContext(CartContext) || { cartItems: JSON.parse(localStorage.getItem('cartItems')) || [] }; 

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- SỬA LỖI Ở ĐÂY: Cấu trúc Menu Items chuẩn Ant Design v5 ---
  // Thay vì viết JSX <Menu>, ta khai báo mảng items
  const menuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Hồ sơ cá nhân</Link>,
    },
    {
      key: 'my-orders',
      icon: <HistoryOutlined />,
      label: <Link to="/myorders">Đơn mua của tôi</Link>,
    },
    
    // --- PHẦN MỚI: MENU ADMIN (Có SubMenu) ---
    ...(user && user.isAdmin ? [
      {
        type: 'divider', // Đường gạch ngang phân cách cho đẹp
      },
      {
        key: 'admin-menu',
        icon: <AppstoreOutlined />,
        label: 'Quản lý hệ thống',
        children: [ // Tạo menu con bên trong
          {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Thống kê (Dashboard)</Link>,
          },
          {
            key: 'admin-coupons',
            icon: <GiftOutlined />,
            label: <Link to="/admin/coupons">Quản lý Voucher</Link>,
          },
          {
            key: 'admin-users',
            icon: <UsergroupAddOutlined />,
            label: <Link to="/admin/users">Quản lý Người dùng</Link>,
          },
          {
            key: 'admin-products',
            icon: <BarcodeOutlined />,
            label: <Link to="/admin/products">Quản lý Sản phẩm</Link>,
          },
          {
            key: 'admin-orders',
            icon: <OrderedListOutlined />,
            label: <Link to="/admin/orders">Quản lý Đơn hàng</Link>,
          },
        ],
      }
    ] : []),
    // ------------------------------------------

    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];
  // -------------------------------------------------------------

  return (
    <AntHeader 
      style={{ 
        background: '#fff', 
        padding: '0 50px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}
    >
      {/* 1. LOGO */}
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ background: '#1890ff', padding: '5px 10px', borderRadius: 8, color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
            P
          </div>
          <span style={{ fontSize: 24, fontWeight: '800', color: '#001529', letterSpacing: '-0.5px' }}>
            Phone<span style={{ color: '#1890ff' }}>Shop</span>
          </span>
        </Link>
      </div>

      {/* 2. SEARCH */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 600 }}>
         <SearchBox />
      </div>

      {/* 3. USER & CART */}
      <Space size={25}>
        <Link to="/cart">
          <Badge count={cartItems?.reduce((acc, item) => acc + Number(item.qty), 0)} showZero>
            <Button 
              shape="circle" 
              icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />} 
              size="large"
              style={{ border: 'none', boxShadow: 'none', background: 'transparent' }}
            />
          </Badge>
        </Link>

        {user ? (
          // SỬA LỖI: Dùng prop 'menu' thay vì 'overlay'
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar 
                style={{ backgroundColor: '#1890ff', verticalAlign: 'middle' }} 
                icon={<UserOutlined />} 
                size="large"
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <Text strong style={{ fontSize: 14 }}>{user.name}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{user.isAdmin ? 'Quản trị viên' : 'Thành viên'}</Text>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Space>
            <Link to="/login">
              <Button type="text">Đăng nhập</Button>
            </Link>
            <Link to="/register">
              <Button type="primary" shape="round">Đăng ký</Button>
            </Link>
          </Space>
        )}
      </Space>

    </AntHeader>
  );
};

export default Header;