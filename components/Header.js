import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <img src="logo2.jpg" alt="AAA Tex Logo" />
        </div>
        <h1><center>AAA Tex</center></h1>
        <div className="user-profile">
          <img src="login.png" alt="User" />
          <div className="dropdown">
            <button className="dropbtn">Profile</button>
            <div className="dropdown-content">
              {/* <Link to="/profile">View Profile</Link> */}
              <Link to="/loginpage">Logout</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="header-bottom">
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/stock-management">Stock Management</Link></li>
            <li><Link to="/employee-attendance">Employee Attendance</Link></li>
            <li><Link to="/salary-calculation">Salary Calculation</Link></li>
            {/* <li><Link to="/gst-calculations">GST Calculations</Link></li> */}
            <li><Link to="/loginpage">Login</Link></li>
            <li><Link to="/registerpage">SignUp</Link></li>
          </ul>
        </nav>
      </div>
      
    </header>
  );
}

export default Header;
