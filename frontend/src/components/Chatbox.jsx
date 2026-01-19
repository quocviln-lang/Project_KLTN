import React, { useEffect } from 'react';

const Chatbox = () => {
  useEffect(() => {
    // 1. Kiểm tra xem script đã có chưa (tránh trùng lặp khi re-render)
    if (document.getElementById('tawk-script')) return;

    // 2. Khởi tạo biến toàn cục Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // 3. Tạo thẻ script và nhúng vào trang web
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    
    s1.async = true;
    s1.id = 'tawk-script'; // Đặt ID để kiểm soát
    
    // --- LINK CỦA BẠN Ở ĐÂY ---
    s1.src = 'https://embed.tawk.to/696cff1d2bf6a3197bbcbbd6/1jf8s93au';
    // -------------------------
    
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);

  }, []);

  return null; // Component này chạy ngầm, không vẽ gì ra giao diện React
};

export default Chatbox;