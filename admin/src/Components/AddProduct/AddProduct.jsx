import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useNavigate } from "react-router-dom";
import { 
  PackagePlus, 
  Tag, 
  Layers, 
  DollarSign, 
  Package, 
  Image as ImageIcon, 
  X,
  Plus
} from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: 1,
    old_price: "",
    new_price: "",
    quantity: "",
  });

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.name === "category" ? Number(e.target.value) : e.target.value,
    });
  };

  const Add_product = async () => {
    if (images.length === 0) {
      setMessage("⚠️ Vui lòng chọn ít nhất 1 ảnh sản phẩm");
      return;
    }

    const formData = new FormData();
    formData.append("name", productDetails.name);
    formData.append("category", productDetails.category);
    formData.append("old_price", productDetails.old_price);
    formData.append("new_price", productDetails.new_price);
    formData.append("quantity", productDetails.quantity);
    
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:4000/products/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Thêm sản phẩm thành công!");
        setTimeout(() => navigate("/listproduct"), 1000);
      } else {
        setMessage("❌ Thêm sản phẩm thất bại");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Lỗi server không thể kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <div className="add-product-header">
          <PackagePlus size={32} className="header-icon" />
          <div>
            <h2>THÊM SẢN PHẨM MỚI</h2>
            <p>Thông tin sản phẩm sẽ được hiển thị ngay lập tức trên cửa hàng người dùng</p>
          </div>
        </div>

        <div className="add-product-form">
          {/* Tên sản phẩm kéo dài hết hàng */}
          <div className="form-item full-width">
            <label><Tag size={18} /> Tên sản phẩm cầu lông *</label>
            <input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={changeHandler}
              placeholder="Ví dụ: Vợt cầu lông Yonex Astrox 100ZZ Kurenai..."
            />
          </div>

          {/* Hàng thứ 2: Giá và Số lượng chia làm 4 cột */}
          <div className="form-grid-3">
            <div className="form-item">
              <label><DollarSign size={17} /> Giá gốc</label>
              <input type="number" name="old_price" value={productDetails.old_price} onChange={changeHandler} placeholder="₫ 0" />
            </div>
            <div className="form-item">
              <label><DollarSign size={17} /> Giá khuyến mãi</label>
              <input type="number" name="new_price" value={productDetails.new_price} onChange={changeHandler} placeholder="₫ 0" />
            </div>
            <div className="form-item">
              <label><Package size={17} /> Số lượng tồn kho</label>
              <input type="number" name="quantity" value={productDetails.quantity} onChange={changeHandler} placeholder="0" />
            </div>
            <div className="form-item">
              <label><Layers size={17} /> Danh mục</label>
              <select name="category" value={productDetails.category} onChange={changeHandler}>
                <option value={1}>Vợt cầu lông</option>
                <option value={2}>Giày cầu lông</option>
                <option value={3}>Áo cầu lông</option>
                <option value={4}>Quả cầu lông</option>
                <option value={5}>Phụ kiện</option>
                <option value={6}>Túi vợt</option>
                <option value={7}>Quấn cán</option>
                <option value={8}>Dây cước</option>
              </select>
            </div>
          </div>

          {/* Hình ảnh sản phẩm trải dài */}
          <div className="form-item full-width">
            <label><ImageIcon size={18} /> Hình ảnh sản phẩm (Nên chọn ảnh nền trắng)</label>
            <div className="image-upload-wrapper">
              <label htmlFor="file-input" className="upload-box">
                <Plus size={35} />
                <span>Thêm ảnh</span>
                <input type="file" id="file-input" multiple hidden onChange={imageHandler} />
              </label>

              {images.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={URL.createObjectURL(img)} alt="preview" />
                  <button onClick={() => removeImage(index)} className="btn-remove-img"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="form-actions">
            <button onClick={() => navigate("/listproduct")} className="btn-cancel">HỦY BỎ</button>
            <button onClick={Add_product} className="btn-submit" disabled={loading}>
              {loading ? "ĐANG XỬ LÝ..." : "LƯU SẢN PHẨM"}
            </button>
          </div>

          {message && (
            <div className={`form-message ${message.includes("✅") ? "success" : "error"}`}>
              {message} 
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;