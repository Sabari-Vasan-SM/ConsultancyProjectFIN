import React from 'react';
import { useLocation } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const location = useLocation();
  const { deliveryDetails, cart } = location.state || { deliveryDetails: {}, cart: [] };

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {cart.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <div className="delivery-details">
            <h3>Delivery Details</h3>
            <p><strong>Name:</strong> {deliveryDetails.name}</p>
            <p><strong>Phone:</strong> {deliveryDetails.phone}</p>
            <p><strong>Address:</strong> {deliveryDetails.address}</p>
          </div>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Orders;