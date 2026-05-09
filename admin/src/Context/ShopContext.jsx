import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  // Quản lý user bằng State để React nhận biết được khi nào login/logout
  const [user, setUser] = useState(null);

  // 1. Hàm load thông tin User từ LocalStorage
  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  // 2. Hàm load giỏ hàng từ Server
  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:4000/api/cart/${userId}`);
      if (!res.ok) return;
      
      const data = await res.json();
      setCartItems(data || []);
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    }
  };

  // Khởi tạo app: Load sản phẩm và User
  useEffect(() => {
    // Load sản phẩm
    fetch("http://localhost:4000/products")
      .then((res) => res.json())
      .then((data) => setAll_Product(data));

    // Load user và cart
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchCart(parsedUser.id);
    }
  }, []);

  // 3. Hàm THÊM VÀO GIỎ
  const addToCart = async (productID) => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.id,
          productID: productID,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Cập nhật lại giỏ hàng ngay lập tức
        fetchCart(user.id);
        // Có thể thêm toast thông báo ở đây
      }
    } catch (err) {
      console.error("Lỗi thêm vào giỏ:", err);
    }
  };

  // 4. Các hàm tăng/giảm số lượng
  const increase = async (productID) => {
    if (!user) return;
    await fetch("http://localhost:4000/api/cart/increase", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID })
    });
    fetchCart(user.id);
  };

  const decrease = async (productID) => {
    if (!user) return;
    await fetch("http://localhost:4000/api/cart/decrease", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID })
    });
    fetchCart(user.id);
  };

  const removeFromCart = async (productID) => {   
    if (!user) return;
    await fetch("http://localhost:4000/api/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.id, productID })
    });
    fetchCart(user.id);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 5. Các hàm tính toán số liệu cho UI
  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => total + (item.new_price * item.quantity), 0);
  };

  const contextValue = {
    all_product,         
    cartItems,
    user,
    setUser, // Để cập nhật user khi đăng nhập thành công
    addToCart,
    removeFromCart,
    getTotalCartItems,
    getTotalCartAmount,
    increase,
    decrease,
    clearCart,
    fetchCart // Export để dùng khi cần
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;