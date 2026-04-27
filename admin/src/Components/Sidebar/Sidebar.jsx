import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
import category from '../../assets/options.png'
import users from '../../assets/user.png'
import orders from '../../assets/order.png'
import stats from '../../assets/stats.png'
import cart from '../../assets/cart.png'
const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/stats'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={stats} width="30px" alt="" />
                <p>statistics </p>
            </div>
        </Link>
        <Link to={'/addproduct'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Add product</p>
            </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Product list</p>
            </div>
        </Link>
        <Link to={'/cart'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={cart} alt="" width="30px"/>
                <p>cart list</p>
            </div>
        </Link>
        <Link to={'/categories'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={category} width="30px" alt="" />
                <p>category list</p>
            </div>
        </Link>
        <Link to={'/users'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={users} width="30px" alt="" />
                <p>Userd list</p>
            </div>
        </Link>
        <Link to={'/orders'} style={{textDecoration: "none"}}>
            <div className="sidebar-item">
                <img src={orders} width="30px" alt="" />
                <p>Orders list</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar