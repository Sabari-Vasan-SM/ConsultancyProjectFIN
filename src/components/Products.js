import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import './Products.css';
import { createClient } from '@supabase/supabase-js';

// Supabase config
const supabaseUrl = 'https://cslnkpnxwqahipwrjqna.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbG5rcG54d3FhaGlwd3JqcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzAxNDksImV4cCI6MjA1NTIwNjE0OX0.jqJ9wbyVFx09RvlNXnLZipCzFvjY2RTfcbO4XoiTfU8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility function to handle image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-product.png';
  if (imagePath.startsWith('http')) return imagePath;
  return `${supabaseUrl}/storage/v1/object/public/products/${imagePath}`;
};

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sortOption, setSortOption] = useState('default');
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and sanitize data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('quantity', 0);

        if (error) throw error;

        const sanitizedData = data.map(product => ({
          ...product,
          price: Number(product.price),
          quantity: Number(product.quantity),
          image_url: product.image_url || null
        }));

        setProductsList(sanitizedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProductsList(prev =>
              prev.map(p =>
                p.id === payload.new.id
                  ? {
                      ...payload.new,
                      price: Number(payload.new.price),
                      quantity: Number(payload.new.quantity),
                      image_url: payload.new.image_url || null
                    }
                  : p
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add to cart with numeric values
  const handleAddToCart = async (product) => {
    try {
      if (quantity > product.quantity) {
        alert(`Only ${product.quantity} items available in stock`);
        return;
      }

      const updatedProducts = productsList.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity - quantity } : p
      );
      setProductsList(updatedProducts);

      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: product.quantity - quantity })
        .eq('id', product.id);

      if (updateError) throw updateError;

      addToCart({
        ...product,
        price: Number(product.price),
        quantity: Number(quantity),
      });

      setSelectedProduct(null);
      setQuantity(1);
    } catch (err) {
      console.error('Error updating product quantity:', err);
      setProductsList(productsList);
      alert('Failed to update product quantity. Please try again.');
    }
  };

  const filteredProducts = productsList.filter(product =>
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const categories = [...new Set(productsList.map(product => product.category))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading products: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="page-title">Our Products</h1>
        <p className="page-subtitle">Find everything you need for your daily life</p>
      </div>

      <div className="products-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="filter-select"
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="no-products">
          <img
            src="https://cdn.dribbble.com/users/2382015/screenshots/6065978/no_result.gif"
            alt="No products found"
          />
          <p>No products match your search criteria</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={getImageUrl(product.image_url)}
                  alt={product.name}
                  className="product-image"
                  onClick={() => setSelectedProduct(product)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-product.png';
                  }}
                />
                {product.quantity <= 5 && (
                  <span className="low-stock-badge">
                    {product.quantity === 0 ? 'Out of Stock' : `Only ${product.quantity} left`}
                  </span>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>
                <p className="product-quantity">Available: {product.quantity}</p>
                <button
                  className="view-details-btn"
                  onClick={() => setSelectedProduct(product)}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="product-modal">
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>
              &times;
            </button>

            <div className="modal-product-image">
              <img 
                src={getImageUrl(selectedProduct.image_url)} 
                alt={selectedProduct.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-product.png';
                }}
              />
              {selectedProduct.quantity <= 5 && (
                <span className="low-stock-badge">
                  {selectedProduct.quantity === 0 ? 'Out of Stock' : `Only ${selectedProduct.quantity} left`}
                </span>
              )}
            </div>

            <div className="modal-product-details">
              <h2>{selectedProduct.name}</h2>
              <p className="modal-category">{selectedProduct.category}</p>
              <p className="modal-description">{selectedProduct.description}</p>

              <div className="price-container">
                <span className="modal-price">₹{selectedProduct.price}</span>
                <span className="modal-quantity">Available: {selectedProduct.quantity}</span>
              </div>

              {selectedProduct.quantity > 0 ? (
                <>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn minus"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      className="quantity-btn plus"
                      onClick={() => setQuantity(prev => Math.min(selectedProduct.quantity, prev + 1))}
                      disabled={quantity >= selectedProduct.quantity}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    Add to Cart - ₹{(selectedProduct.price * quantity).toFixed(2)}
                  </button>
                </>
              ) : (
                <button className="out-of-stock-btn" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;