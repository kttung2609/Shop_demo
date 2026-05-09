// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ProductDisplayAdmin from "../Components/ProductDisplayAdmin/ProductDisplayAdmin";

// const ProductAdmin = () => {
//   // BƯỚC 1: Kiểm tra App.jsx xem là :id hay :productId. 
//   // Tôi giả sử bạn đang dùng :productId dựa trên các câu hỏi trước.
//   const { productId } = useParams(); 
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Nếu productId bị undefined, thông báo ngay
//     if (!productId) {
//       console.error("LỖI: Không lấy được ID từ URL. Kiểm tra lại App.jsx");
//       return;
//     }

//     setLoading(true);
//     fetch(`http://localhost:4000/products/${productId}`)
//       .then(res => res.json())
//       .then(data => {
//         // BƯỚC 2: Kiểm tra cấu trúc data. 
//         // Nếu server trả về { data: [...] } thì lấy data.data
//         const fetchedProduct = data.data || data; 
//         setProduct(fetchedProduct);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Lỗi fetch:", err);
//         setLoading(false);
//       });
//   }, [productId]);

//   if (loading) return <div style={{padding: "100px", textAlign: "center", fontSize: "20px"}}>🌀 Đang tải dữ liệu sản phẩm...</div>;
  
//   if (!product) return <div style={{padding: "100px", textAlign: "center", color: "red"}}>❌ Không tìm thấy thông tin sản phẩm (ID: {productId})</div>;

//   return <ProductDisplayAdmin product={product} />;
// };

// export default ProductAdmin;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDisplayAdmin from "../Components/ProductDisplayAdmin/ProductDisplayAdmin";

const ProductAdmin = () => {
  // Tên này PHẢI khớp với tên trong App.jsx (productId)
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Gọi API với productId lấy được từ URL
    fetch(`http://localhost:4000/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        // Lưu dữ liệu vào state product
        setProduct(data.data || data); 
      })
      .catch(err => console.error("Lỗi fetch:", err));
  }, [productId]);

  // Khi chưa có dữ liệu, ProductDisplayAdmin sẽ hiện "Đang tải"
  // Khi có dữ liệu, nó sẽ render giao diện
  return <ProductDisplayAdmin product={product} />;
};

export default ProductAdmin;