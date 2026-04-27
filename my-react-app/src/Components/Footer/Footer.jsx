import React from 'react';
import './Footer.css';
// Thay đổi import ở đây
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* Cột 1: Giới thiệu */}
          <div className="footer-col">
            <h3 className="footer-logo">BADMINTON<span>SHOP</span></h3>
            <p className="footer-desc">
              Chuyên cung cấp dụng cụ cầu lông chính hãng từ các thương hiệu hàng đầu thế giới. Uy tín và chất lượng tạo nên thương hiệu.
            </p>
            <div className="social-links">
              {/* Sử dụng icon mới */}
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>

          {/* Cột 2: Danh mục */}
          <div className="footer-col">
            <h4>DANH MỤC</h4>
            <ul>
              <li><a href="#">Vợt Cầu Lông</a></li>
              <li><a href="#">Giày Cầu Lông</a></li>
              <li><a href="#">Áo Cầu Lông</a></li>
              <li><a href="#">Phụ Kiện</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="footer-col">
            <h4>HỖ TRỢ KHÁCH HÀNG</h4>
            <ul>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Vận chuyển & Giao nhận</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="footer-col">
            <h4>LIÊN HỆ</h4>
            <div className="contact-info">
              <p><FaMapMarkerAlt /> Đường 35 thôn Xuân Long, xã Kim Anh, Hà Nội</p>
              <p><FaPhoneAlt /> 0123.456.789</p>
              <p><FaEnvelope /> support@badmintonshop.vn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Badminton Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;