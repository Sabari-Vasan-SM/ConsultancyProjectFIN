import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import './Invoice.css';

const supabaseUrl = 'https://cslnkpnxwqahipwrjqna.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbG5rcG54d3FhaGlwd3JqcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzAxNDksImV4cCI6MjA1NTIwNjE0OX0.jqJ9wbyVFx09RvlNXnLZipCzFvjY2RTfcbO4XoiTfU8';
const supabase = createClient(supabaseUrl, supabaseKey);

const Invoice = () => {
  const { cart } = useContext(CartContext);
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const totalAmount = cart.reduce((total, item) => {
    const qty = Number(item.quantity) || 1;
    return total + item.price * qty;
  }, 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Velavan Super Stores', doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Phone: 9047665999', 14, 30);
    doc.text('Email: velavansuperstores@gmail.com', 14, 36);
    doc.text('GST No: 22AAXFV7324B1Z0', 14, 42);
    doc.text('Location: Bhavani main road, Salangapalayam, Tamil Nadu-638455', 14, 48);

    const date = new Date();
    doc.text(`Date: ${date.toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 14, 30, { align: 'right' });
    doc.text(`Time: ${date.toLocaleTimeString()}`, doc.internal.pageSize.getWidth() - 14, 36, { align: 'right' });

    doc.line(14, 50, 200, 50);

    const tableColumn = ['Product', 'Price', 'Quantity', 'Total'];
    const tableRows = cart.map(item => {
      const qty = Number(item.quantity) || 1;
      return [item.name, `₹${item.price}`, qty, `₹${item.price * qty}`];
    });

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 60 });
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${totalAmount}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save('invoice.pdf');
  };

  const handleRazorpayPayment = () => {
    const options = {
      key: 'rzp_test_cmLeqKg61pFBgh',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Velavan Super Stores',
      description: 'Test Transaction',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        setShowPopup(true);
      },
      prefill: {
        name: deliveryDetails.name,
        email: 'example@example.com',
        contact: deliveryDetails.phone,
      },
      theme: {
        color: '#5a2d82',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = () => {
    setShowPopup(true);
  };

  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setShowPopup(false);

    try {
      const { data, error } = await supabase.from('orders').insert([
        {
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          total_amount: totalAmount,
          items: JSON.stringify(cart),
          order_date: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error('Error inserting order:', error.message);
      } else {
        console.log('Order saved:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    setTimeout(() => {
      navigate('/orders', { state: { deliveryDetails, cart } });
    }, 2000);
  };

  return (
    <motion.div 
      className="invoice-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="invoice-header">
        <motion.h2 
          className="invoice-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Invoice
        </motion.h2>
        <motion.div 
          className="store-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="store-name">Velavan Super Stores</h3>
          <p className="store-detail">Bhavani main road, Salangapalayam</p>
          <p className="store-detail">Tamil Nadu-638455</p>
          <p className="store-detail">GST No: 22AAXFV7324B1Z0</p>
        </motion.div>
      </div>

      {cart.length === 0 ? (
        <motion.div 
          className="empty-cart"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <motion.button 
            className="back-to-shop-btn"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Shop
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className="invoice-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="invoice-details">
            <div className="detail-row header">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>

            <AnimatePresence>
              {cart.map((item, index) => {
                const qty = Number(item.quantity) || 1;
                return (
                  <motion.div 
                    className="detail-row"
                    key={`${item.id}-${index}`}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <span className="product-name">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="product-thumbnail"
                        />
                      )}
                      {item.name}
                    </span>
                    <span>₹{item.price}</span>
                    <span>{qty}</span>
                    <span className="item-total">₹{item.price * qty}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <motion.div 
              className="total-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span>Total Amount:</span>
              <span className="total-amount">₹{totalAmount.toFixed(2)}</span>
            </motion.div>
          </div>

          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              className="action-btn download-btn"
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Invoice
            </motion.button>
            <motion.button 
              className="action-btn razorpay-btn"
              onClick={handleRazorpayPayment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pay with Razorpay
            </motion.button>
            <motion.button 
              className="action-btn payment-btn"
              onClick={handlePlaceOrder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Place Order
            </motion.button>
          </motion.div>

          {orderPlaced && (
            <motion.div 
              className="order-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon">✔</div>
              <p>Your order has been placed successfully!</p>
              <div className="success-loader">
                <div className="loader-circle"></div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="popup-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="popup">
                <h3>Enter Delivery Details</h3>
                <form onSubmit={handlePopupSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={deliveryDetails.name}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={deliveryDetails.phone}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={deliveryDetails.address}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="popup-buttons">
                    <motion.button 
                      type="submit" 
                      className="submit-btn"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Submit
                    </motion.button>
                    <motion.button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowPopup(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Invoice;