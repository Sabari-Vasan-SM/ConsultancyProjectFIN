import React, { useContext, useState } from 'react';
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
      key: "rzp_test_cmLeqKg61pFBgh", // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "Velavan Super Stores",
      description: "Payment for your purchase",
      image: "/logo.png", // Replace with your logo
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        saveInvoiceToSupabase(); // Save invoice after successful payment
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
    <div className="invoice-container">
      <h2>Invoice</h2>
      {cart.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <div>
          <h3>Velavan Super Stores</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</li>
            ))}
          </ul>
          <h3>Total Amount: ₹{totalAmount}</h3>
          
          <button onClick={handleDownloadPDF}>Download PDF</button>
          <button onClick={saveInvoiceToSupabase} disabled={saving} style={{ marginLeft: '10px' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleRazorpayPayment} style={{ marginLeft: '10px' }}>Pay with Razorpay</button>
          <button onClick={() => setShowQR(!showQR)} style={{ marginLeft: '10px' }}>Generate Payment</button>
          
          {showQR && (
            <div className="qr-container">
              <h3>Scan to Pay</h3>
              <QRCodeCanvas value={`upi://pay?pa=sabarivasan1239@okhdfcbank&pn=Velavan%20Super%20Stores&am=${totalAmount}&cu=INR`} size={200} />
              <p>UPI ID: sabarivasan1239@okhdfcbank</p>
            </div>
          )}
          
          <button onClick={() => setShowSMSInput(!showSMSInput)} style={{ marginLeft: '10px' }}>Send SMS</button>
          {showSMSInput && (
            <div>
              <input type="text" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <button onClick={handleSendSMS}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoice;