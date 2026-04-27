import React from "react";
import "./ShopCategory.css";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  const badminton = [
    { name: "Vợt cầu lông", icon: "🏸", value: 1 },
    { name: "Giày cầu lông", icon: "👟", value: 2 },
    { name: "Bao vợt", icon: "👜", value: 6 },
    { name: "Áo cầu lông", icon: "👕", value: 3 },
    { name: "Phụ kiện", icon: "🎯", value: 5 },
    { name: "Quả cầu", icon: "🏸", value: 4 },
    { name: "Dây cước", icon: "🧵", value: 8 },
    { name: "Quấn cán", icon: "🎗", value: 7 }
  ];

  return (
    <div className="category">

      <div className="category-header">
        <h2>DANH MỤC SẢN PHẨM</h2>
        <p>Chọn danh mục bạn quan tâm</p>
      </div>

      <div className="category-grid">
        {badminton.map((item, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => navigate(`/products?category=${item.value}`)}
          >
            <div className="category-icon">{item.icon}</div>
            <h4>{item.name}</h4>
            <span>Xem ngay →</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Category;