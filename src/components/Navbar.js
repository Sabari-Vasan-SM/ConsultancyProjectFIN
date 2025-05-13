import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeLink]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 1500,
      onClose: () => navigate('/'),
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const linkVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/home" className="logo-link">
              <h2 className="logo">
                <motion.span 
                  className="logo-icon"
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  🛒
                </motion.span> 
                <span className="logo-text">Velavan Super Stores</span>
              </h2>
            </Link>
          </motion.div>

          {isMobileView && (
            <motion.button 
              className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <motion.span 
                className="menu-bar"
                animate={{ 
                  y: mobileMenuOpen ? 8 : 0,
                  rotate: mobileMenuOpen ? 45 : 0 
                }}
              ></motion.span>
              <motion.span 
                className="menu-bar"
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
              ></motion.span>
              <motion.span 
                className="menu-bar"
                animate={{ 
                  y: mobileMenuOpen ? -8 : 0,
                  rotate: mobileMenuOpen ? -45 : 0 
                }}
              ></motion.span>
            </motion.button>
          )}

          {!isMobileView ? (
            <ul className="nav-links">
              {[
                { path: '/home', icon: '🏠', text: 'Home' },
                { path: '/products', icon: '🛍️', text: 'Products' },
                { path: '/cart', icon: '🛒', text: 'Cart' },
                { path: '/invoice', icon: '🧾', text: 'Invoice' },
                { path: '/orders', icon: '📦', text: 'Orders' },
              ].map((item) => (
                <li key={item.path}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={item.path}
                      className={`nav-link ${activeLink === item.path ? 'active' : ''}`}
                      onClick={() => setActiveLink(item.path)}
                    >
                      <span className="link-icon">{item.icon}</span>
                      <span className="link-text">{item.text}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          ) : (
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div 
                  className="mobile-menu-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={toggleMobileMenu}
                ></motion.div>
              )}
              <motion.ul 
                className="nav-links mobile"
                initial="closed"
                animate={mobileMenuOpen ? "open" : "closed"}
                variants={menuVariants}
              >
                {[
                  { path: '/home', icon: '🏠', text: 'Home' },
                  { path: '/products', icon: '🛍️', text: 'Products' },
                  { path: '/cart', icon: '🛒', text: 'Cart' },
                  { path: '/invoice', icon: '🧾', text: 'Invoice' },
                  { path: '/orders', icon: '📦', text: 'Orders' },
                ].map((item) => (
                  <motion.li 
                    key={item.path}
                    variants={linkVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${activeLink === item.path ? 'active' : ''}`}
                      onClick={() => setActiveLink(item.path)}
                    >
                      <span className="link-icon">{item.icon}</span>
                      <span className="link-text">{item.text}</span>
                    </Link>
                  </motion.li>
                ))}
                <motion.li 
                  className="mobile-logout"
                  variants={linkVariants}
                >
                  <motion.button 
                    className="logout-button"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔒 Logout
                  </motion.button>
                </motion.li>
              </motion.ul>
            </AnimatePresence>
          )}

          {!isMobileView && (
            <motion.button 
              className="logout-button desktop-logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔒 Logout
            </motion.button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;