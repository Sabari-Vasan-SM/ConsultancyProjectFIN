import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleLogout = () => {
    // Add actual logout logic here (e.g., Supabase signOut or clear auth token)
    console.log("Logged out");
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/home" className="logo-link">
          <h2 className="logo">
            <span className="logo-icon">🛒</span>
            Velavan Super Stores
          </h2>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/home" className={`nav-link ${activeLink === '/home' ? 'active' : ''}`} onClick={() => setActiveLink('/home')}>
              <span className="link-icon">🏠</span>
              <span className="link-text">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className={`nav-link ${activeLink === '/products' ? 'active' : ''}`} onClick={() => setActiveLink('/products')}>
              <span className="link-icon">🛍️</span>
              <span className="link-text">Products</span>
            </Link>
          </li>
          <li>
            <Link to="/cart" className={`nav-link ${activeLink === '/cart' ? 'active' : ''}`} onClick={() => setActiveLink('/cart')}>
              <span className="link-icon">🛒</span>
              <span className="link-text">Cart</span>
            </Link>
          </li>
          <li>
            <Link to="/invoice" className={`nav-link ${activeLink === '/invoice' ? 'active' : ''}`} onClick={() => setActiveLink('/invoice')}>
              <span className="link-icon">🧾</span>
              <span className="link-text">Invoice</span>
            </Link>
          </li>
          <li>
            <Link to="/orders" className={`nav-link ${activeLink === '/orders' ? 'active' : ''}`} onClick={() => setActiveLink('/orders')}>
              <span className="link-icon">📦</span>
              <span className="link-text">Orders</span>
            </Link>
          </li>
        </ul>

        <button className="logout-button" onClick={handleLogout}>
          🔒 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
