import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const CouponListPage = () => {
  const { user } = useContext(AuthContext);

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  /**
   * 1. Fetch danh sách coupon
   * - Bọc useCallback
   * - Chỉ phụ thuộc user.token (nguồn dữ liệu thực)
   */
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get('/api/coupons', config);
      setCoupons(data);
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải danh sách mã');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  /**
   * 2. useEffect chỉ phụ thuộc fetchCoupons
   * -> Không loop
   * -> Không cascading render
   */
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  /**
   * 3. Tạo coupon mới
   * -> Sau khi tạo xong gọi fetchCoupons trực tiếp
   */
  const handleCreate = async (values) => {
    setCreating(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.post(
        '/api/coupons',
        {
          name: values.name,
          discount: values.discount,
          expiry: values.expiry.toDate(),
        },
        config
      );

      message.success('Tạo mã giảm giá thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchCoupons();
    } catch (error) {
      message.error(error.response?.data?.message || 'Tạo thất bại');
    } finally {
      setCreating(false);
    }
  };

  /**
   * 4. Xóa coupon
   */
  const handleDelete = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`/api/coupons/${id}`, config);
      message.success('Đã xóa mã');
      fetchCoupons();
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi xóa');
    }
  };

  // Columns bảng
  const columns = [
    {
      title: 'Mã Voucher',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: (val) => `${val}%`,
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiry',
      key: 'expiry',
      render: (date) => {
        const isExpired = new Date(date) < new Date();
        return (
          <span style={{ color: isExpired ? 'red' : 'green' }}>
            {new Date(date).toLocaleDateString('vi-VN')}
            {isExpired && ' (Hết hạn)'}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Bạn chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record._id)}
        >
          <Button danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2>
          <GiftOutlined /> Quản lý Mã Giảm Giá
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Tạo mã mới
        </Button>
      </div>

      <Table
        dataSource={coupons}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />

      {/* MODAL TẠO MỚI */}
      <Modal
        title="Tạo Voucher Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="Tên mã (VD: SALE50)"
            name="name"
            rules={[{ required: true, message: 'Nhập tên mã' }]}
          >
            <Input style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item
            label="Phần trăm giảm (%)"
            name="discount"
            rules={[{ required: true, message: 'Nhập % giảm' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Ngày hết hạn"
            name="expiry"
            rules={[{ required: true, message: 'Chọn ngày hết hạn' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={creating}
            block
          >
            TẠO MÃ NGAY
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponListPage;
