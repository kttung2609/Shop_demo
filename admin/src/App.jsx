import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin/Admin";



const App = () => {
  return (
    // <BrowserRouter>
    <div>
      <Navbar />

      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
      
    // </BrowserRouter>
  );
};

export default App;