// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar';
import AdminLogin from './components/AdminLogin';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Invoice from './components/Invoice';
import Contact from './components/Contact';
import StockManagement from './components/StockManagement';
import Orders from './components/Orders';

import './App.css';

// Create a spacer to push the content below the Navbar
const NavbarSpacer = () => <div className="navbar-spacer" />;

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Show Navbar only if not on login page */}
      {location.pathname !== '/' && (
        <>
          <Navbar />
          <NavbarSpacer />
        </>
      )}

      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/stock" element={<StockManagement />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;