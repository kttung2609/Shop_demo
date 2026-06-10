import React, { useState } from "react";
import { useEffect } from "react";
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
  Plus,
  Edit
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
    description: "",
    weight: "",
    max_tension: "",
    balance_point: "",
    brand: "",
    stiffness: "",
    material: "",
  });

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/brands');
        const json = await res.json();
        if (Array.isArray(json)) setBrands(json);
        else if (json.success && json.data) setBrands(json.data);
      } catch (err) { console.error('Failed to fetch brands', err); }
    };
    fetchBrands();
  }, []);

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
    formData.append("description", productDetails.description);
    formData.append("weight", productDetails.weight);
    formData.append("max_tension", productDetails.max_tension);
    formData.append("balance_point", productDetails.balance_point);
    formData.append("brand_id", productDetails.brand);
    formData.append("stiffness", productDetails.stiffness);
    formData.append("material", productDetails.material);
    
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
        setMessage(data.message ? `❌ ${data.message}` : "❌ Thêm sản phẩm thất bại");
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

          <div className="form-item full-width">
            <label><Edit size={18} /> Mô tả sản phẩm</label>
            <textarea
              name="description"
              value={productDetails.description}
              onChange={changeHandler}
              placeholder="Nhập mô tả ngắn gọn về sản phẩm..."
            />
          </div>

          <div className="form-grid-3">
            <div className="form-item">
              <label><Package size={17} /> Trọng lượng</label>
              <input
                type="text"
                name="weight"
                value={productDetails.weight}
                onChange={changeHandler}
                placeholder="Ví dụ: 4U (83g)"
              />
            </div>
            <div className="form-item">
              <label><Package size={17} /> Mức căng</label>
              <input
                type="text"
                name="max_tension"
                value={productDetails.max_tension}
                onChange={changeHandler}
                placeholder="Ví dụ: 11-12.5kg"  
              />
            </div>
            <div className="form-item">
              <label><Package size={17} /> Điểm cân bằng</label>
              <input
                type="text"
                name="balance_point"
                value={productDetails.balance_point}
                onChange={changeHandler}
                placeholder="Ví dụ: 310mm"
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-item">
              <label><Package size={17} /> Độ cứng</label>
              <input
                type="text"
                name="stiffness"
                value={productDetails.stiffness}
                onChange={changeHandler}
                placeholder="Ví dụ: Medium"
              />
            </div>
            <div className="form-item">
              <label><Package size={17} /> Chất liệu</label>
              <input
                type="text"
                name="material"
                value={productDetails.material}
                onChange={changeHandler}
                placeholder="Ví dụ: Graphite"
              />
            </div>
          </div>

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
              <label><Package size={17} /> Số lượng tồn kho <span className="optional-label">(không bắt buộc)</span></label>
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
            <div className="form-item">
              <label><Tag size={17} /> Thương hiệu</label>
              <select name="brand" value={productDetails.brand} onChange={changeHandler}>
                <option value="">Chọn thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

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