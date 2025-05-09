import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { QRCodeCanvas } from 'qrcode.react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import './Invoice.css';

const supabase = createClient(
  'https://cslnkpnxwqahipwrjqna.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbG5rcG54d3FhaGlwd3JqcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzAxNDksImV4cCI6MjA1NTIwNjE0OX0.jqJ9wbyVFx09RvlNXnLZipCzFvjY2RTfcbO4XoiTfU8'
);

const Invoice = () => {
  const { cart } = useContext(CartContext);
  const [showQR, setShowQR] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSMSInput, setShowSMSInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const saveInvoiceToSupabase = async () => {
    setSaving(true);
  
    const date = new Date().toISOString();
    const invoiceData = {
      date,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      total_amount: totalAmount
    };
  
    const { data, error } = await supabase.from('invoices').insert([invoiceData]);
  
    setSaving(false);
  
    if (error) {
      console.error('Supabase Error:', error);
      alert(`Failed to save invoice: ${error.message}`);
    } else {
      console.log('Invoice saved:', data);
      alert('Invoice saved successfully!');
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
    const tableRows = cart.map(item => [item.name, `₹${item.price}`, item.quantity, `₹${item.price * item.quantity}`]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 60 });
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹${totalAmount}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save('invoice.pdf');
  };

  const handleSendSMS = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }
    
    const message = `Your purchase details:\n${cart.map(item => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}\nTotal Amount: ₹${totalAmount}\n\nThank you for shopping with Velavan Super Stores!`;
    
    try {
      await axios.post('https://api.twilio.com/2010-04-01/Accounts/AC11bdfa290a8300b120cf299eebd540cf/Messages.json',
        new URLSearchParams({
          To: phoneNumber,
          From: '+19137324506',
          Body: message
        }),
        {
          auth: {
            username: 'AC11bdfa290a8300b120cf299eebd540cf',
            password: '6979edaf3225e278358c003e7a9a7bc9'
          }
        }
      );
      alert('SMS sent successfully!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS.');
    }
  };

  const handleRazorpayPayment = () => {
    const options = {
      key: "rzp_test_cmLeqKg61pFBgh",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Velavan Super Stores",
      description: "Payment for your purchase",
      image: "/logo.png",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        saveInvoiceToSupabase();
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className={`invoice-container ${isVisible ? 'visible' : ''}`}>
      <div className="invoice-header">
        <h2 className="invoice-title">Your Invoice</h2>
        <div className="store-info">
          <h3 className="store-name">Velavan Super Stores</h3>
          <p className="store-detail">Bhavani main road, Salangapalayam</p>
          <p className="store-detail">Tamil Nadu-638455</p>
          <p className="store-detail">GST No: 22AAXFV7324B1Z0</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div className="invoice-content">
          <div className="invoice-details">
            <div className="detail-row header">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>
            
            {cart.map((item, index) => (
              <div className="detail-row" key={index}>
                <span className="product-name">{item.name}</span>
                <span>₹{item.price}</span>
                <span>{item.quantity}</span>
                <span className="item-total">₹{item.price * item.quantity}</span>
              </div>
            ))}
            
            <div className="total-row">
              <span>Total Amount:</span>
              <span className="total-amount">₹{totalAmount}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="action-btn download-btn"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
            
            <button 
              className="action-btn save-btn"
              onClick={saveInvoiceToSupabase} 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Invoice'}
            </button>
            
            <button 
              className="action-btn payment-btn"
              onClick={handleRazorpayPayment}
            >
              Pay with Razorpay
            </button>
            
            <button 
              className="action-btn qr-btn"
              onClick={() => setShowQR(!showQR)}
            >
              {showQR ? 'Hide QR' : 'Show Payment QR'}
            </button>
            
            <button 
              className="action-btn sms-btn"
              onClick={() => setShowSMSInput(!showSMSInput)}
            >
              {showSMSInput ? 'Cancel SMS' : 'Send SMS Receipt'}
            </button>
          </div>

          {showQR && (
            <div className="qr-section">
              <h3 className="qr-title">Scan to Pay via UPI</h3>
              <div className="qr-code-container">
                <QRCodeCanvas 
                  value={`upi://pay?pa=sabarivasan1239@okhdfcbank&pn=Velavan%20Super%20Stores&am=${totalAmount}&cu=INR`} 
                  size={200} 
                  className="qr-code"
                />
              </div>
              <p className="upi-id">UPI ID: sabarivasan1239@okhdfcbank</p>
            </div>
          )}
          
          {showSMSInput && (
            <div className="sms-section">
              <div className="sms-input-group">
                <input 
                  type="text" 
                  placeholder="Enter phone number with country code" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="sms-input"
                />
                <button 
                  onClick={handleSendSMS}
                  className="send-sms-btn"
                >
                  Send SMS
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoice;