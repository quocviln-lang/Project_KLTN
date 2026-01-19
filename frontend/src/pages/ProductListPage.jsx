import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const { Title } = Typography;

const ProductListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh sách sản phẩm
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra quyền + load dữ liệu
  useEffect(() => {
    if (!user) return;

    if (user.isAdmin) {
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [user, navigate, fetchProducts]);

  // Xóa sản phẩm
  const deleteHandler = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`/api/products/${id}`, config);
      message.success('Đã xóa sản phẩm');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa');
    }
  };

  // Tạo sản phẩm mới
  const createProductHandler = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post('/api/products', {}, config);
      message.success('Đã tạo sản phẩm mẫu');
      navigate(`/admin/product/${data._id}/edit`);
    } catch (error) {
      console.error(error);
      message.error('Lỗi tạo sản phẩm');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      render: (text) => `${text.substring(0, 10)}...`,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => (
        <img
          src={record.image || record.thumbnail || 'https://via.placeholder.com/40'}
          alt={record.name}
          style={{
            width: 40,
            height: 40,
            objectFit: 'contain',
            border: '1px solid #f0f0f0',
          }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        price ? `${price.toLocaleString()}đ` : 'Chưa có giá',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Link to={`/admin/product/${record._id}/edit`}>
            <Button icon={<EditOutlined />} size="small">
              Sửa
            </Button>
          </Link>
          <Popconfirm
            title="Xóa sản phẩm này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => deleteHandler(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Title level={2}>Quản lý Sản phẩm</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={createProductHandler}>
          Tạo sản phẩm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default ProductListPage;
