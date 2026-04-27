import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

// Import Swiper React components & styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Category from "../../Pages/ShopCategory/ShopCategory";
import Item from "../../Components/Items/Item";
import Footer from "../Footer/Footer";
import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Danh sách Banner từ link bạn cung cấp
  const banners = [
    {
      image: "https://cdn.shopvnb.com/img/1920x640/uploads/slider/1000z-launch-website-banner_1695177885.webp",
      title: "YONEX ASTROX 1000Z",
      desc: "Siêu phẩm tấn công mạnh mẽ nhất 2024"
    },
    {
      image: "https://cdn.shopvnb.com/img/1920x640/uploads/slider/victor-axelsen_1759089349.webp",
      title: "VICTOR x AXELSEN",
      desc: "Đẳng cấp nhà vô địch thế giới"
    },
    {
      image: "https://hvshop.vn/wp-content/uploads/2026/04/hundred-nitrix-pro-banner.webp",
      title: "HUNDRED NITRIX PRO",
      desc: "Công nghệ mới, bứt phá tốc độ"
    }
  ];

  useEffect(() => {
    fetch("http://localhost:4000/products?limit=200")
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []));
  }, []);

  const getProductsByCategory = (list, categoryId) => {
    return list.filter((p) => p.category_id === categoryId).slice(0, 4);
  };

  const renderSection = (title, categoryId, productList, brands) => (
    <section className="home-section">
      <div className="section-header">
        <div className="header-left">
          <h2 className="section-title">{title}</h2>
          <div className="title-underline"></div>
        </div>
        <div className="brand-list">
          {brands.map((brand) => (
            <button key={brand} className="brand-chip" onClick={() => navigate(`/products?category=${categoryId}&brand=${brand}`)}>
              {brand.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="view-all-btn" onClick={() => navigate(`/products?category=${categoryId}`)}>XEM TẤT CẢ</button>
      </div>
      <div className="home-products-grid">
        {productList.map((item) => (
          <Item key={item.id} {...item} image={item.images?.[0]} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="home-container">
      {/* PHẦN BANNER SLIDER MỚI */}
      <div className="home-hero-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect={'fade'} // Hiệu ứng mờ dần sang chảnh
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="mySwiper"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div className="slider-item">
                <img src={banner.image} alt={banner.title} />
                <div className="slider-content">
                  <h2 className="animate-title">{banner.title}</h2>
                  <p className="animate-desc">{banner.desc}</p>
                  <button className="hero-btn" onClick={() => navigate('/products')}>MUA NGAY</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="service-policy">
        <div className="policy-item">
          <Truck className="policy-icon" />
          <div><h4>Giao hàng nhanh</h4><p>Toàn quốc</p></div>
        </div>
        <div className="policy-item">
          <ShieldCheck className="policy-icon" />
          <div><h4>Chính hãng</h4><p>Bảo hành 100%</p></div>
        </div>
        <div className="policy-item">
          <RotateCcw className="policy-icon" />
          <div><h4>Đổi trả</h4><p>Trong 7 ngày</p></div>
        </div>
        <div className="policy-item">
          <Headphones className="policy-icon" />
          <div><h4>Tư vấn</h4><p>Hỗ trợ 24/7</p></div>
        </div>
      </div>

      <Category />

      <div className="main-sections">
        {renderSection("VỢT CẦU LÔNG", 1, getProductsByCategory(products, 1), ["yonex", "lining", "victor"])}
        
        <div className="mid-banner-ads">
          <img src="https://cdn.shopvnb.com/img/1920x640/uploads/slider/grpht-thrttl_1759089897.webp" alt="Ads" />
        </div>

        {renderSection("GIÀY CẦU LÔNG", 2, getProductsByCategory(products, 2), ["yonex", "lining", "mizuno"])}
        {renderSection("ÁO CẦU LÔNG", 3, getProductsByCategory(products, 3), ["yonex", "lining", "victor"])}
      </div>

      <Footer />
    </div>
  );
};

export default Home;