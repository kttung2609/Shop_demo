import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {

  const imageUrl = props.image
    ? `http://localhost:4000/uploads/${props.image}`
    : "http://localhost:4000/uploads/default.jpg";

  const discount = props.old_price
    ? Math.round(((props.old_price - props.new_price) / props.old_price) * 100)
    : 0;

  return (
    <Link to={`/product/${props.id}`} className="item-card">

      {/* IMAGE */}
      <div className="item-image">

        <img src={imageUrl} alt={props.name} />

        {/* DISCOUNT */}
        {discount > 0 && (
          <span className="badge sale">-{discount}%</span>
        )}

        {/* STOCK */}
        {props.quantity <= 0 && (
          <span className="badge out">Hết hàng</span>
        )}

        {/* HOVER */}
        <div className="overlay">
          <button>Xem chi tiết</button>
        </div>

      </div>

      {/* INFO */}
      <div className="item-content">

        <h3 className="item-title">{props.name}</h3>

        <div className="price-box">
          <span className="new">
            {Number(props.new_price).toLocaleString("vi-VN")}₫
          </span>

          {props.old_price > 0 && (
            <span className="old">
              {Number(props.old_price).toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>

        <div className="stock">
          {props.quantity > 0
            ? `Còn ${props.quantity} sản phẩm`
            : "Hết hàng"}
        </div>

      </div>

    </Link>
  );
};

export default Item;