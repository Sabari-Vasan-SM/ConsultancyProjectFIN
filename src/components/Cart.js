import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Corrected import path
import './Cart.css';
const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total Amount: ₹{totalAmount}</h3>
        </div>
      )}
    </div>
  );
};
export default Cart;