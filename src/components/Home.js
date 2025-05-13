import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = [
    { name: "Snacks", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/SBCTILES/UPDATED/Snacks__biscuits.jpg" },
    { name: "Masalas", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/SBCTILES/UPDATED/Masala_sugar__spices.jpg" },
    { name: "Cleaning", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/SBCTILES/UPDATED/Household__toilet_cleaners.jpg" },
    { name: "Chocolates", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/SBCTILES/UPDATED/Chocolates__sweets.jpg" },
    { name: "Beverages", image: "https://images-eu.ssl-images-amazon.com/images/G/31/img18/Fresh/SBCTILES/UPDATED/Tea_coffee__drink_mixes.jpg" }
  ];

  const brands = [
    { name: "Britannia", image: "https://m.media-amazon.com/images/I/71I-KF81TaL._AC_UL480_QL65_.jpg" },
    { name: "Colgate", image: "https://m.media-amazon.com/images/I/61QYq3SwS9L._AC_UL480_QL65_.jpg" },
    { name: "Nestle", image: "https://m.media-amazon.com/images/I/81jQyyBKiIL._AC_UL480_QL65_.jpg" },
    { name: "Dove", image: "https://m.media-amazon.com/images/I/51D3ux9kYgL._AC_UL480_QL65_.jpg" },
    { name: "Head & Shoulders", image: "https://m.media-amazon.com/images/I/61ANB+67sgL._AC_UL480_QL65_.jpg" }
  ];

  const slides = [
    "https://www.bigbasket.com/media/uploads/banner_images/hp_m_babycare_250923_400.jpg",
    "https://www.bigbasket.com/media/uploads/banner_images/hp_bcd_m_bcd_250923_400.jpg",
    "https://www.bigbasket.com/media/uploads/banner_images/hp_m_health_suppliment_250923_400.jpg",
    "https://www.bigbasket.com/media/uploads/banner_images/hp_m_petstore_250923_400.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleShopNow = () => {
    navigate("/products"); // Navigate to the Products page
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span>Velavan Super Stores</span>
          </h1>
          <p className="hero-description">
            Your one-stop destination for all daily needs with quality products at affordable prices.
          </p>
          <button className="hero-button" onClick={handleShopNow}>
            Shop Now
          </button>
        </div>
        {!isMobile && <div className="hero-image"></div>}
      </section>

      {/* Carousel Section */}
      <section className="carousel-section">
        <div className="carousel">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-image" style={{ backgroundImage: `url(${category.image})` }} />
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands">
        <h2 className="section-title">Our Brands</h2>
        <div className="brand-grid">
          {brands.map((brand, index) => (
            <div 
              key={index} 
              className="brand-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="brand-image" style={{ backgroundImage: `url(${brand.image})` }} />
              <p>{brand.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🛒</div>
          <h3>Wide Range of Products</h3>
          <p>From fresh produce to household essentials, we have everything you need.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Fast & Reliable Delivery</h3>
          <p>Get your groceries delivered to your doorstep with our quick service.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💰</div>
          <h3>Best Prices & Offers</h3>
          <p>Enjoy the best discounts and deals on all your favorite brands.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;