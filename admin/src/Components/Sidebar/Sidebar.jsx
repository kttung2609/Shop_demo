import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Boxes, 
  ShoppingCart, 
  Tags, 
  Users, 
  ClipboardList,
    BarChart3,
    CreditCard,
    Eye
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <NavLink to="/stats" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <BarChart3 size={22} />
            <p>Thống kê</p>
        </NavLink>

        <NavLink to="/addproduct" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <PackagePlus size={22} />
            <p>Thêm sản phẩm</p>
        </NavLink>

        <NavLink to="/listproduct" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <Boxes size={22} />
            <p>Danh sách sản phẩm</p>
        </NavLink>

        <NavLink to="/cart" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <ShoppingCart size={22} />
            <p>Giỏ hàng hệ thống</p>
        </NavLink>

        <NavLink to="/categories" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <Tags size={22} /> 
            <p>Danh mục</p>
        </NavLink>
        
        <NavLink to="/brands" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <Tags size={22} /> 
            <p>Thương hiệu</p>
        </NavLink>

        <NavLink to="/users" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <Users size={22} />
            <p>Quản lý thành viên</p>
        </NavLink>

        <NavLink to="/orders" className={({isActive}) => isActive ? "sidebar-item active" : "sidebar-item"}>
            <ClipboardList size={22} />
            <p>Quản lý đơn hàng</p>
        </NavLink>

        
    </div>
  );
};

export default Sidebar;