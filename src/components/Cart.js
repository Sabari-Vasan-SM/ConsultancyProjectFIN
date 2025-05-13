import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Cart.css';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const totalAmount = cart.reduce((total, item) => {
    const qty = Number(item.quantity) || 1;
    return total + item.price * qty;
  }, 0);

  // Animation variants
  const cartItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.2 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/invoice'); // Navigate to the Invoice page
  };

  return (
    <div className="cart-container">
      <motion.h2 
        className="cart-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Your Shopping Cart
      </motion.h2>

      {cart.length === 0 ? (
        <motion.div 
          className="empty-cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start adding some delicious items!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="cart-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {cart.map((item, index) => {
              const qty = Number(item.quantity) || 1;
              const itemTotal = item.price * qty;
              
              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  className="cart-item-card"
                  variants={cartItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="item-image-container">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="item-image" />
                    ) : (
                      <div className="item-image-placeholder">📦</div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      <span className="item-price">₹{item.price}</span>
                      <span className="item-quantity">× {qty}</span>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <span className="item-total">₹{itemTotal.toFixed(2)}</span>
                    <motion.button 
                      className="remove-btn"
                      onClick={() => removeFromCart(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div 
            className="cart-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
            <motion.button 
              className="checkout-btn"
              onClick={handleProceedToCheckout} // Call the navigation function
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;