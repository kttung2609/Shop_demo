import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDisplayAdmin from "../Components/ProductDisplayAdmin/ProductDisplayAdmin";

const ProductAdmin = () => {

  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
      })
      .catch(err => console.error(err));
  }, [id]);

  return <ProductDisplayAdmin product={product} />;
};

export default ProductAdmin;