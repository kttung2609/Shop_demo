
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDisplayAdmin from "../Components/ProductDisplayAdmin/ProductDisplayAdmin";

const ProductAdmin = () => {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        // Lưu dữ liệu vào state product
        setProduct(data.data || data); 
      })
      .catch(err => console.error("Lỗi fetch:", err));
  }, [productId]);

  return <ProductDisplayAdmin product={product} />;
};

export default ProductAdmin;