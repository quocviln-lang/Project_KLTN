import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, message, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Kiểm tra quyền Admin & Lấy danh sách user
  useEffect(() => {
    if (user && user.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login'); // Không phải Admin thì đá về trang login
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
        console.error(error);
      message.error('Lỗi lấy danh sách user');
      setLoading(false);
    }
  };

  // 2. Hàm xử lý xóa user (Sẽ làm chức năng backend sau, giờ cứ để frontend trước)
  const deleteHandler = (id) => {
    message.warning('Chức năng xóa đang phát triển');
  };

  // 3. Cấu hình cột cho bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <span style={{ color: '#888' }}>{text.substring(0, 10)}...</span>,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      key: 'name',
      fontWeight: 'bold',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Là Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      align: 'center',
      render: (isAdmin) => (
        isAdmin 
          ? <CheckOutlined style={{ color: 'green', fontSize: 18 }} /> 
          : <CloseOutlined style={{ color: 'red', fontSize: 18 }} />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            style={{ color: 'blue', marginRight: 10 }}
            onClick={() => message.info('Chức năng sửa user: Phase sau')}
          />
          
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => deleteHandler(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '30px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Quản Lý Người Dùng</h2>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="_id" 
        loading={loading}
        bordered
      />
    </div>
  );
};

export default UserListPage;