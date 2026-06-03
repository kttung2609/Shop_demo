import React, { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/me/user", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
      }
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    }
    return null;
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cart", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetch("http://localhost:4000/products").then(res => res.json()).then(data => setAll_Product(data.data || data));
    fetchUserData().then(u => { if (u) fetchCart(); });

    const handlePageShow = (event) => {
      if (event.persisted) {
        fetchUserData().then(u => { if (u) fetchCart(); });
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const addToCart = async (productID) => {
    if (!user) return toast.warning("Vui lòng đăng nhập!");
    
    try {
      const product = all_product.find(p => p.id === productID);
      const productName = product?.name || "sản phẩm";

      const res = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productID, quantity: 1 }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`✅ Đã thêm "${productName}" vào giỏ hàng`);
        fetchCart();
      } else {
        toast.error(data.message || "Lỗi khi thêm vào giỏ hàng");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Lỗi kết nối server!");
    }
  };

  const removeFromCart = async (productID) => {
    if (!user) return toast.warning("Vui lòng đăng nhập!");
    
    try {
      const res = await fetch("http://localhost:4000/api/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productID }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Đã xóa khỏi giỏ hàng");
        fetchCart();
      } else {
        toast.error(data.message || "Lỗi khi xóa khỏi giỏ hàng");
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Lỗi kết nối server!");
    }
  };

  const increase = async (productID) => {
    if (!user) return toast.warning("Vui lòng đăng nhập!");
    
    try {
      const res = await fetch("http://localhost:4000/api/cart/increase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productID }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCart();
      } else {
        toast.error(data.message || "Lỗi khi tăng số lượng");
      }
    } catch (err) {
      console.error("Error increasing quantity:", err);
      toast.error("Lỗi kết nối server!");
    }
  };

  const decrease = async (productID) => {
    if (!user) return toast.warning("Vui lòng đăng nhập!");
    
    try {
      const res = await fetch("http://localhost:4000/api/cart/decrease", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productID }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCart();
      } else {
        toast.error(data.message || "Lỗi khi giảm số lượng");
      }
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      toast.error("Lỗi kết nối server!");
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const res = await fetch("http://localhost:4000/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setCartItems([]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error clearing cart:", err);
      return false;
    }
  };

  const contextValue = {
    all_product, cartItems, setCartItems, user, setUser,
    addToCart, removeFromCart, increase, decrease, clearCart, fetchCart, fetchUserData,
    getTotalCartItems: () => cartItems.reduce((total, item) => total + item.quantity, 0),
    getTotalCartAmount: () => cartItems.reduce((total, item) => total + (item.new_price * item.quantity), 0),
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;