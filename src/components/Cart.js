// Cart.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  const totalAmount = cart.reduce((total, item) => {
    const qty = Number(item.quantity) || 1;
    return total + item.price * qty;
  }, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cart.map((item, index) => {
              const qty = Number(item.quantity) || 1;
              return (
                <li key={index}>
                  {item.name} - ₹{item.price} x {qty} = ₹{item.price * qty}
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </li>
              );
            })}
          </ul>
          <h3>Total Amount: ₹{totalAmount}</h3>
        </div>
      )}
    </div>
  );
};

export default Cart;