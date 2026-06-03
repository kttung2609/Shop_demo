import React, { useEffect, useState } from "react";
import "./UpdateProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Edit, 
  Tag, 
  Layers, 
  DollarSign, 
  Package, 
  ImageIcon, 
  X, 
  Plus,
  ArrowLeft
} from "lucide-react";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);          // Ảnh mới chọn
  const [oldImages, setOldImages] = useState([]);    // Ảnh hiện tại trên server
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
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
    fetch(`http://localhost:4000/products/${id}`)
      .then(res => res.json())
      .then(product => {
        if (product) {
          setProductDetails({
            name: product.name,
            category: product.category_id,
            old_price: product.old_price,
            new_price: product.new_price,
            quantity: product.quantity,
            description: product.description || "",
            weight: product.weight || "",
            max_tension: product.max_tension || product.tension || "",
            balance_point: product.balance_point || "",
            brand: product.brand_id || "",
            stiffness: product.stiffness || "",
            material: product.material || "",
          });
          setOldImages(product.images || []);
        }
      });
    const fetchBrands = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/brands');
        const json = await res.json();
        if (Array.isArray(json)) setBrands(json);
        else if (json.success && json.data) setBrands(json.data);
      } catch (err) { console.error('Failed to fetch brands', err); }
    };
    fetchBrands();
  }, [id]);

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async () => {
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
    formData.append("oldImages", JSON.stringify(oldImages));

    if (images.length > 0) {
      images.forEach((img) => {
        formData.append("images", img);
      });
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/products/update/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Cập nhật thành công!");
        window.dispatchEvent(new Event("productUpdated"));
        setTimeout(() => navigate("/listproduct"), 1000);
      }
    } catch (err) {
      setMessage("❌ Cập nhật thất bại!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-product-container">
      <div className="update-product-card">
        <div className="update-product-header">
          <Edit size={32} className="header-icon" />
          <div>
            <h2>CHỈNH SỬA SẢN PHẨM</h2>
            <p>ID Sản phẩm: #{id} - Cập nhật thông tin và hình ảnh mới</p>
          </div>
        </div>

        <div className="update-product-form">
          <div className="form-item full-width">
            <label><Tag size={18} /> Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              value={productDetails.name}
              onChange={changeHandler}
              placeholder="Nhập tên sản phẩm..."
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
              <label><Package size={17} /> Balance point</label>
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
              <label><Package size={17} /> Stiffness</label>
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


          <div className="form-grid-4">
            <div className="form-item">
              <label><DollarSign size={17} /> Giá gốc</label>
              <input type="number" name="old_price" value={productDetails.old_price} onChange={changeHandler} />
            </div>
            <div className="form-item">
              <label><DollarSign size={17} /> Giá bán</label>
              <input type="number" name="new_price" value={productDetails.new_price} onChange={changeHandler} />
            </div>
            <div className="form-item">
              <label><Package size={17} /> Tồn kho</label>
              <input type="number" name="quantity" value={productDetails.quantity} onChange={changeHandler} />
            </div>
            <div className="form-item">
              <label><Layers size={17} /> Danh mục</label>
              <select name="category" value={productDetails.category} onChange={changeHandler}>
                <option value="1">Vợt</option>
                <option value="2">Giày</option>
                <option value="3">Áo</option>
                <option value="4">Cầu</option>
                <option value="5">Phụ kiện</option>
                <option value="6">Túi</option>
                <option value="7">Quấn cán</option>
                <option value="8">Dây cước</option>
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
            <label><ImageIcon size={18} /> Ảnh hiện tại trên hệ thống</label>
            <div className="image-manager-wrapper">
              {oldImages.length > 0 ? (
                oldImages.map((img, index) => (
                  <div key={index} className="preview-item">
                    <img src={`http://localhost:4000/uploads/${img}`} alt="current" />
                    <div className="img-label">Hiện tại</div>
                  </div>
                ))
              ) : (
                <p className="no-img-text">Sản phẩm này chưa có ảnh.</p>
              )}
            </div>
          </div>

          <div className="form-item full-width">
            <label><Plus size={18} /> Tải lên ảnh mới (Thay thế toàn bộ ảnh cũ)</label>
            <div className="image-manager-wrapper new-uploads">
              <label htmlFor="file-input" className="upload-box">
                <Plus size={35} />
                <span>Thêm ảnh</span>
                <input type="file" id="file-input" multiple hidden onChange={imageHandler} />
              </label>

              {images.map((img, index) => (
                <div key={index} className="preview-item new">
                  <img src={URL.createObjectURL(img)} alt="new preview" />
                  <button onClick={() => removeNewImage(index)} className="btn-remove-img"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => navigate("/listproduct")} className="btn-back">
              <ArrowLeft size={18} /> QUAY LẠI
            </button>
            <button onClick={updateProduct} className="btn-update" disabled={loading}>
              {loading ? "ĐANG LƯU..." : "CẬP NHẬT SẢN PHẨM"}
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

export default UpdateProduct;