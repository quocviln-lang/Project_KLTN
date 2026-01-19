import React from 'react';
import { Steps } from 'antd';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  // Mapping trạng thái: Nếu props truyền vào là true thì bước đó đã xong (finish) hoặc đang làm (process)
  const items = [
    { title: 'Đăng nhập', status: step1 ? 'finish' : 'wait' },
    { title: 'Địa chỉ', status: step2 ? 'process' : (step2 === false ? 'wait' : 'finish') }, 
    // Logic này hơi phức tạp xíu để Antd hiện màu cho đúng, nhưng bạn cứ copy là chạy
    { title: 'Thanh toán', status: step3 ? 'wait' : 'wait' },
    { title: 'Đặt hàng', status: step4 ? 'wait' : 'wait' },
  ];

  // Sửa lại logic đơn giản hơn cho bạn dễ hiểu:
  // step1, step2... là các biến boolean (true/false) báo hiệu bước đó đã kích hoạt chưa
  
  return (
    <div style={{ marginBottom: 40, marginTop: 20 }}>
      <Steps 
        current={step2 ? 1 : step3 ? 2 : step4 ? 3 : 0} 
        items={[
            { title: 'Đăng nhập' },
            { title: 'Giao hàng' },
            { title: 'Thanh toán' },
            { title: 'Đặt đơn' },
        ]}
      />
    </div>
  );
};

export default CheckoutSteps;