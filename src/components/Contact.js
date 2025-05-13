import React from "react";

import "./Contact.css";

const Contact = () => {
  return (
    <div>
      
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out to us through any of the methods below.</p>

        <div className="contact-details">
          <div className="contact-card">
            <h3>📍 Address</h3>
            <p>Velava Super Stores</p>
            <p>123, Main Road, Coimbatore, Tamil Nadu, India - 641001</p>
          </div>

          <div className="contact-card">
            <h3>📞 Phone</h3>
            <p>Customer Support: <strong>+91 98765 43210</strong></p>
            <p>Wholesale Enquiries: <strong>+91 87654 32109</strong></p>
          </div>

          <div className="contact-card">
            <h3>📧 Email</h3>
            <p>Support: <strong>support@velavasuperstores.com</strong></p>
            <p>Business: <strong>business@velavasuperstores.com</strong></p>
          </div>

          <div className="contact-card">
            <h3>🕒 Working Hours</h3>
            <p>Monday - Saturday: 9:00 AM - 9:00 PM</p>
            <p>Sunday: 10:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
