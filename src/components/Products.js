import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Products.css';

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sortOption, setSortOption] = useState('default');

  // Product data remains the same
  const productsList = [
    // ... (your existing product data)
    { "id": 1, "name": "Dove Soap", "price": 30, "category": "Soap", "description": "A gentle soap for daily use.", "image": "https://rukminim2.flixcart.com/image/280/280/xif0q/soap/b/q/c/3-375-advanced-sensitive-care-bar-125g-x-3-dove-original-imah4zrympnqvdug.jpeg?q=70" },
  { "id": 2, "name": "Lux Soap", "price": 25, "category": "Soap", "description": "A luxurious soap for smooth skin.", "image": "https://rukminim2.flixcart.com/image/280/280/xif0q/soap/k/b/z/-original-imah8ckagpagqzhm.jpeg?q=70" },
  { "id": 3, "name": "Pears Soap", "price": 45, "category": "Soap", "description": "A transparent glycerin soap for soft skin.", "image": "https://m.media-amazon.com/images/I/61PVolPfATL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 4, "name": "Clinic Plus Shampoo", "price": 110, "category": "Shampoo", "description": "A protein-rich shampoo for healthy hair.", "image": "https://rukminim2.flixcart.com/image/280/280/xif0q/shampoo/x/j/8/-original-imagrzrjhcsjkn2h.jpeg?q=70" },
  { "id": 5, "name": "Dove Shampoo", "price": 180, "category": "Shampoo", "description": "A nourishing shampoo for soft hair.", "image": "https://rukminim2.flixcart.com/image/280/280/xif0q/shampoo/n/u/7/-original-imah7eyznck4chgc.jpeg?q=70" },
  { "id": 6, "name": "Sunsilk Shampoo", "price": 150, "category": "Shampoo", "description": "A smoothening shampoo for silky hair.", "image": "https://m.media-amazon.com/images/I/51K-LLtOXWL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 7, "name": "Bru Instant Coffee", "price": 160, "category": "Coffee", "description": "A strong instant coffee blend.", "image": "https://m.media-amazon.com/images/I/618UobAPMrL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 8, "name": "Nescafe Classic Coffee", "price": 220, "category": "Coffee", "description": "A rich and aromatic instant coffee.", "image": "https://m.media-amazon.com/images/I/71kSJv+gUIL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 9, "name": "Narasu's Filter Coffee", "price": 180, "category": "Coffee", "description": "A popular South Indian filter coffee.", "image": "https://m.media-amazon.com/images/I/61pGE-5NrgL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 10, "name": "Tata Tea Gold", "price": 130, "category": "Tea", "description": "A strong and flavorful tea.", "image": "https://m.media-amazon.com/images/I/610ELwpmPHL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 11, "name": "Lipton Green Tea", "price": 180, "category": "Tea", "description": "A healthy green tea alternative.", "image": "https://m.media-amazon.com/images/I/51n8lK8MwNL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 12, "name": "Red Label Tea", "price": 110, "category": "Tea", "description": "A widely used strong tea blend.", "image": "https://m.media-amazon.com/images/I/51aO+7bz3dL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 13, "name": "Cadbury Dairy Milk", "price": 50, "category": "Chocolate", "description": "A creamy milk chocolate.", "image": "https://m.media-amazon.com/images/I/61PzgeMkUOL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 14, "name": "Nestle KitKat", "price": 40, "category": "Chocolate", "description": "A crispy wafer chocolate.", "image": "https://m.media-amazon.com/images/I/71t+cwWDQ8L._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 15, "name": "5 Star Chocolate", "price": 35, "category": "Chocolate", "description": "A chewy caramel chocolate.", "image": "https://m.media-amazon.com/images/I/51VxXgzjzWL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 16, "name": "GRB Ghee", "price": 550, "category": "Ghee", "description": "A pure and aromatic ghee.", "image": "https://m.media-amazon.com/images/I/71c3SG1xPHL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 17, "name": "Amul Ghee", "price": 520, "category": "Ghee", "description": "A premium quality ghee.", "image": "https://m.media-amazon.com/images/I/71f0OmdXdfL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 17, "name": "Amul Ghee - 1litre", "price": 510, "category": "Ghee", "description": "A premium quality ghee.", "image": "https://www.bigbasket.com/media/uploads/p/l/40046233_4-amul-amul-ghee-2-l.jpg" },
  { "id": 18, "name": "Aavin Ghee - 1litre", "price": 700, "category": "Ghee", "description": "A locally preferred dairy ghee.", "image": "https://www.bigbasket.com/media/uploads/p/l/40036727_1-aavin-ghee.jpg" },
  { "id": 19, "name": "Idhayam Gingelly Oil - 1litre", "price": 378, "category": "Oil", "description": "A popular sesame oil brand in Tamil Nadu.", "image": "https://www.bigbasket.com/media/uploads/p/l/148681_8-idhayam-oil-gingelly.jpg" },
  { "id": 20, "name": "Gold Winner Sunflower Oil- 1litre", "price": 118, "category": "Oil", "description": "A widely used cooking oil in Tamil Nadu.", "image": "https://m.media-amazon.com/images/I/71uJ0F8-kIL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 21, "name": "Fortune Sunflower Oil - 1litre", "price": 108, "category": "Oil", "description": "A refined and pure sunflower oil.", "image": "https://www.jiomart.com/images/product/original/490000052/fortune-sunlite-refined-sunflower-oil-1-l-product-images-o490000052-p490000052-0-202203150155.jpg?im=Resize=(420,420)" },
  { "id": 22, "name": "Colgate Toothpaste", "price": 65, "category": "Toothpaste", "description": "A widely used fluoride toothpaste.", "image": "https://m.media-amazon.com/images/I/61XMUdBuJ6L._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 23, "name": "Sensodyne Toothpaste", "price": 102, "category": "Toothpaste", "description": "A toothpaste for sensitive teeth.", "image": "https://m.media-amazon.com/images/I/51hJph2+-wL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 24, "name": "Close-Up Toothpaste", "price": 40, "category": "Toothpaste", "description": "A gel-based toothpaste for fresh breath.", "image": "https://m.media-amazon.com/images/I/51H8t6JIrDL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 25, "name": "Britannia Good Day Biscuits", "price": 32, "category": "Biscuits", "description": "A crunchy and tasty biscuit.", "image": "https://m.media-amazon.com/images/I/61IhdI0oN8L._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 26, "name": "Parle-G Biscuits", "price": 92, "category": "Biscuits", "description": "A classic glucose biscuit.", "image": "https://m.media-amazon.com/images/I/71bufOt9zAL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 27, "name": "Hide & Seek Fab Biscuits", "price": 28, "category": "Biscuits", "description": "A choco-filled biscuit delight.", "image": "https://m.media-amazon.com/images/I/61OZQN4AQ5L._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 28, "name": "Urid Dal - 1kg", "price": 116, "category": "Pulses", "description": "A commonly used dal in South Indian dishes.", "image": "https://m.media-amazon.com/images/I/81TboOByzAL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 29, "name": "Toor Dal - 1kg", "price": 103, "category": "Pulses", "description": "A nutritious lentil used in sambars.", "image":"https://m.media-amazon.com/images/I/91nZuaJTrnL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 30, "name": "Moong Dal - 1kg", "price": 107, "category": "Pulses", "description": "A light and easily digestible dal.", "image": "https://m.media-amazon.com/images/I/91JsALx2o4L._AC_UL480_FMwebp_QL65_.jpg" },

  { "id": 31, "name": "Everest Chilli Powder - 100g", "price": 86, "category": "Spices", "description": "A vibrant red chili powder for spicy dishes.", "image": "https://m.media-amazon.com/images/I/61hjaXERodL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 32, "name": "MDH Garam Masala - 100g", "price": 87, "category": "Spices", "description": "A blend of aromatic spices for Indian curries.", "image":"https://m.media-amazon.com/images/I/71F5t572b5L._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 33, "name": "Everest Turmeric Powder - 100g", "price": 46, "category": "Spices", "description": "A pure turmeric powder for healthy cooking.", "image": "https://cdn.shopify.com/s/files/1/0280/4111/7770/products/83.jpg?v=1645226871&width=800" },
  { "id": 34, "name": "Sakthi Coriander Powder - 100g", "price": 29, "category": "Spices", "description": "A fresh coriander powder for flavorful dishes.", "image": "https://m.media-amazon.com/images/I/91ytRByr3FL._AC_UL480_FMwebp_QL65_.jpg" },
  { "id": 35, "name": "Everest Cumin Powder - 100g", "price": 57, "category": "Spices", "description": "A strong cumin powder for rich taste.","image":"https://m.media-amazon.com/images/I/81Y4dOt-V1L._AC_UL480_FMwebp_QL65_.jpg" }
  ];

  const filteredProducts = productsList.filter(product => {
    return (category === 'All' || product.category === category) && 
           product.name.toLowerCase().includes(search.toLowerCase());
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortOption) {
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

  const handleAddToCart = (product) => {
    addToCart(product, quantity);
    setSelectedProduct(null);
    setQuantity(1);
  };

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
          <img src="https://cdn.dribbble.com/users/2382015/screenshots/6065978/no_result.gif" alt="No products found" />
          <p>No products match your search criteria</p>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onClick={() => setSelectedProduct(product)}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>
                <button 
                  className="view-details-btn"
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
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
            <button 
              className="close-modal"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            
            <div className="modal-product-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            
            <div className="modal-product-details">
              <h2>{selectedProduct.name}</h2>
              <p className="modal-category">{selectedProduct.category}</p>
              <p className="modal-description">{selectedProduct.description}</p>
              
              <div className="price-container">
                <span className="modal-price">₹{selectedProduct.price}</span>
              </div>
              
              <div className="quantity-controls">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn plus"
                  onClick={() => setQuantity(prev => prev + 1)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;