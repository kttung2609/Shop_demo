import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './Components/Navbar/Navbar'
import { ChatBot } from './Components/ChatBot/ChatBot'

import Main_page from './Pages/Main_page'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
import Profile from "./Components/Profile/Proflie";
import Checkout from "./Components/Checkout/Checkout";
import ShopCategory from './Pages/ShopCategory/ShopCategory'
import Orders from "./Components/Orders/Orders";
import Popular from "./Components/Popular/Popular";
import products from "./Pages/Product";
import review from "./Components/ReviewModal/ReviewModal";
import { useEffect } from "react";




function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <ChatBot />

      <Routes>
      
        <Route path="/products" element={<Popular />} />
        <Route path='/' element={<Main_page />} />
        <Route path="/search" element={<Popular />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path='/vot' element={<ShopCategory category="vot" />} />

        <Route path='/giay' element={<ShopCategory category="giay" />} />

        <Route path='/ao' element={<ShopCategory category="ao" />} />

        <Route path='/cau' element={<ShopCategory category="cau" />} />

        <Route path='/phukien' element={<ShopCategory category="phukien" />} />

        <Route path='/products/:productId' element={<Product />} />

        <Route path='/cart' element={<Cart />} />

        <Route path='/login' element={<LoginSignup />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/review" element={<Orders />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App