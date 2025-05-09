import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';
import "./StockManagement.css";

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cslnkpnxwqahipwrjqna.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbG5rcG54d3FhaGlwd3JqcW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MzAxNDksImV4cCI6MjA1NTIwNjE0OX0.jqJ9wbyVFx09RvlNXnLZipCzFvjY2RTfcbO4XoiTfU8';
const supabase = createClient(supabaseUrl, supabaseKey);

const StockManagement = () => {
  const [stock, setStock] = useState([]);
  const [newItem, setNewItem] = useState({ 
    name: "", 
    quantity: "", 
    price: "", 
    supplier: "", 
    category: "",
    threshold: 10 
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);

  // Categories for dropdown
  const categories = [
    "Dairy",
    "Groceries",
    "Cleaning",
    "Grooming",
    "Stationery",
    "Other"
  ];

  // Load stock from Supabase when component mounts
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('stock_items')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        setStock(data || []);
      } catch (error) {
        console.error('Error fetching stock:', error.message);
        // Fallback to local storage if Supabase fails
        const savedStock = JSON.parse(localStorage.getItem("stock")) || [];
        setStock(savedStock);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStock();
  }, []);

  // Save stock to local storage as fallback
  useEffect(() => {
    localStorage.setItem("stock", JSON.stringify(stock));
  }, [stock]);

  // Add new stock item or update existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.quantity || !newItem.price || !newItem.supplier) {
      alert("Please fill all required fields!");
      return;
    }
    
    try {
      if (editId) {
        // Update existing item
        const { data, error } = await supabase
          .from('stock_items')
          .update(newItem)
          .eq('id', editId)
          .select();
        
        if (error) throw error;
        
        setStock(stock.map(item => 
          item.id === editId ? data[0] : item
        ));
        setEditId(null);
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('stock_items')
          .insert([{ ...newItem }])
          .select();
        
        if (error) throw error;
        
        setStock([...stock, data[0]]);
      }
      
      setNewItem({ 
        name: "", 
        quantity: "", 
        price: "", 
        supplier: "", 
        category: "",
        threshold: 10 
      });
    } catch (error) {
      console.error('Error saving item:', error.message);
      // Fallback to local state if Supabase fails
      if (editId) {
        setStock(stock.map(item => 
          item.id === editId ? { ...newItem, id: editId } : item
        ));
      } else {
        setStock([...stock, { ...newItem, id: Date.now() }]);
      }
    }
  };

  // Delete stock item
  const deleteStock = async (id) => {
    try {
      const { error } = await supabase
        .from('stock_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setStock(stock.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error.message);
      // Fallback to local state if Supabase fails
      setStock(stock.filter((item) => item.id !== id));
    }
  };

  // Edit stock item
  const editStock = (id) => {
    const itemToEdit = stock.find(item => item.id === id);
    setNewItem(itemToEdit);
    setEditId(id);
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedStock = [...stock].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filter and search
  const filteredStock = sortedStock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Check for low-stock items
  const lowStockItems = stock.filter((item) => item.quantity < (item.threshold || 10));

  // Calculate total stock value
  const totalValue = stock.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="loading-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p>Loading stock data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="stock-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="header">📦 Stock Management System</h2>

      <div className="summary-cards">
        <motion.div 
          className="summary-card total-items"
          whileHover={{ scale: 1.03 }}
        >
          <h3>Total Items</h3>
          <p>{stock.length}</p>
        </motion.div>
        
        <motion.div 
          className="summary-card low-stock"
          whileHover={{ scale: 1.03 }}
        >
          <h3>Low Stock</h3>
          <p>{lowStockItems.length}</p>
        </motion.div>
        
        <motion.div 
          className="summary-card total-value"
          whileHover={{ scale: 1.03 }}
        >
          <h3>Total Value</h3>
          <p>₹{totalValue.toLocaleString()}</p>
        </motion.div>
      </div>

      <motion.form 
        className="stock-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Item Name*</label>
            <input 
              type="text" 
              placeholder="Enter item name" 
              value={newItem.name} 
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Quantity*</label>
            <input 
              type="number" 
              placeholder="Enter quantity" 
              value={newItem.quantity} 
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || "" })} 
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price (₹)*</label>
            <input 
              type="number" 
              placeholder="Enter price" 
              value={newItem.price} 
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || "" })} 
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Supplier*</label>
            <input 
              type="text" 
              placeholder="Enter supplier" 
              value={newItem.supplier} 
              onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Low Stock Threshold</label>
            <input 
              type="number" 
              placeholder="Threshold" 
              value={newItem.threshold} 
              onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) || 10 })} 
              min="1"
            />
          </div>
        </div>
        
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="submit-btn"
        >
          {editId ? "Update Item" : "Add Item"}
        </motion.button>
        
        {editId && (
          <button 
            type="button" 
            onClick={() => {
              setEditId(null);
              setNewItem({ 
                name: "", 
                quantity: "", 
                price: "", 
                supplier: "", 
                category: "",
                threshold: 10 
              });
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </motion.form>

      {lowStockItems.length > 0 && (
        <motion.div 
          className="alert low-stock-alert"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>⚠ Low Stock Alert!</h3>
          <div className="alert-items">
            {lowStockItems.map((item) => (
              <motion.div 
                key={item.id}
                className="alert-item"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <span>{item.name}</span>
                <span>Only {item.quantity} left (threshold: {item.threshold || 10})</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search items or suppliers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort("name")}>
                Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => requestSort("quantity")}>
                Qty {sortConfig.key === "quantity" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => requestSort("price")}>
                Price {sortConfig.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => requestSort("supplier")}>
                Supplier {sortConfig.key === "supplier" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th>Category</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredStock.length > 0 ? (
                filteredStock.map((item) => (
                  <motion.tr 
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={item.quantity < (item.threshold || 10) ? "low-stock" : ""}
                  >
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toLocaleString()}</td>
                    <td>{item.supplier}</td>
                    <td>{item.category || "-"}</td>
                    <td>₹{(item.quantity * item.price).toLocaleString()}</td>
                    <td className="actions">
                      <motion.button 
                        onClick={() => editStock(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="edit-btn"
                      >
                        ✏️
                      </motion.button>
                      <motion.button 
                        onClick={() => deleteStock(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="delete-btn"
                      >
                        🗑️
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    No items found. {searchTerm && `Try a different search term.`}
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StockManagement;