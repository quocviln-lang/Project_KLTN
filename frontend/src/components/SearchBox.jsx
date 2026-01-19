import React, { useState } from 'react';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/search/${value}`); // Chuyển hướng sang trang kết quả tìm kiếm
    } else {
      navigate('/'); // Nếu xóa trắng thì về trang chủ
    }
  };

  return (
    <Search
      placeholder="Tìm điện thoại, phụ kiện..."
      onSearch={onSearch}
      onChange={(e) => setKeyword(e.target.value)}
      enterButton
      style={{ width: 400 }} // Độ dài thanh tìm kiếm
    />
  );
};

export default SearchBox;