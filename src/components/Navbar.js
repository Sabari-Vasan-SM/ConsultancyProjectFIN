import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  /* Detect scroll for shadow/background change */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Highlight the current route */
  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  /* Handle window resize for mobile view detection */
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Close mobile menu when route changes */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeLink]);

  /* Logout flow with confirmation */
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return; // user cancelled

    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 1500,
      onClose: () => navigate('/'), // redirect after toast closes
    });
  };

  /* Toggle mobile menu */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <ToastContainer />
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/home" className="logo-link">
            <h2 className="logo">
              <span className="logo-icon">🛒</span> 
              <span className="logo-text">Velavan Super Stores</span>
            </h2>
          </Link>

          {/* Mobile menu button - only shows on mobile */}
          {isMobileView && (
            <button 
              className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
            </button>
          )}

          {/* Navigation links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <Link
                to="/home"
                className={`nav-link ${activeLink === '/home' ? 'active' : ''}`}
                onClick={() => setActiveLink('/home')}
              >
                <span className="link-icon">🏠</span>
                <span className="link-text">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`nav-link ${activeLink === '/products' ? 'active' : ''}`}
                onClick={() => setActiveLink('/products')}
              >
                <span className="link-icon">🛍️</span>
                <span className="link-text">Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className={`nav-link ${activeLink === '/cart' ? 'active' : ''}`}
                onClick={() => setActiveLink('/cart')}
              >
                <span className="link-icon">🛒</span>
                <span className="link-text">Cart</span>
              </Link>
            </li>
            <li>
              <Link
                to="/invoice"
                className={`nav-link ${activeLink === '/invoice' ? 'active' : ''}`}
                onClick={() => setActiveLink('/invoice')}
              >
                <span className="link-icon">🧾</span>
                <span className="link-text">Invoice</span>
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className={`nav-link ${activeLink === '/orders' ? 'active' : ''}`}
                onClick={() => setActiveLink('/orders')}
              >
                <span className="link-icon">📦</span>
                <span className="link-text">Orders</span>
              </Link>
            </li>
            
            {/* Mobile Logout - only shows in mobile menu */}
            {isMobileView && (
              <li className="mobile-logout">
                <button className="logout-button" onClick={handleLogout}>
                  🔒 Logout
                </button>
              </li>
            )}
          </ul>

          {/* Desktop Logout button - only shows on desktop */}
          {!isMobileView && (
            <button className="logout-button desktop-logout" onClick={handleLogout}>
              🔒 Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;