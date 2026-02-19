import React, { useState, useEffect } from 'react';
import './Navbar.css';
import MegaMenu from './MegaMenu';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuEnter = (menu) => {
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="top-bar-left">
              <a href="#greencard">GREENCARD</a>
              <span className="separator">|</span>
              <a href="#giftcard">GIFT CARD</a>
              <span className="separator">|</span>
              <a href="#store">STORE LOCATOR</a>
              <span className="separator">|</span>
              <a href="#track">TRACK ORDER</a>
              <span className="separator">|</span>
              <a href="#contact">CONTACT</a>
            </div>
            <div className="top-bar-right">
              <span>ENTIRE COLLECTION</span>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
              <span className="store-icon">🏪</span>
              <span>STORE MODE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`main-nav ${isSticky ? 'sticky' : ''}`}>
        <div className="container">
          <div className="nav-wrapper">
            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Logo */}
            <div className="nav-logo">
              <a href="/">CLASSMORA</a>
            </div>

            {/* Navigation Links */}
            <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <li 
                className="nav-item"
                onMouseEnter={() => handleMenuEnter('women')}
                onMouseLeave={handleMenuLeave}
              >
                <a href="#women">WOMEN</a>
                {activeMenu === 'women' && <MegaMenu category="women" />}
              </li>
              <li 
                className="nav-item"
                onMouseEnter={() => handleMenuEnter('men')}
                onMouseLeave={handleMenuLeave}
              >
                <a href="#men">MEN</a>
                {activeMenu === 'men' && <MegaMenu category="men" />}
              </li>
              <li 
                className="nav-item"
                onMouseEnter={() => handleMenuEnter('kids')}
                onMouseLeave={handleMenuLeave}
              >
                <a href="#kids">KIDS</a>
                {activeMenu === 'kids' && <MegaMenu category="kids" />}
              </li>
              <li 
                className="nav-item"
                onMouseEnter={() => handleMenuEnter('home')}
                onMouseLeave={handleMenuLeave}
              >
                <a href="#home">HOME & LIVING</a>
                {activeMenu === 'home' && <MegaMenu category="home" />}
              </li>
              <li 
                className="nav-item"
                onMouseEnter={() => handleMenuEnter('brands')}
                onMouseLeave={handleMenuLeave}
              >
                <a href="#brands">BRANDS</a>
                {activeMenu === 'brands' && <MegaMenu category="brands" />}
              </li>
              <li 
                className="nav-item"
                onMouseEnter={() => handleMenuEnter('sale')}
                onMouseLeave={handleMenuLeave}
              >
                <a href="#sale">SALE</a>
                {activeMenu === 'sale' && <MegaMenu category="sale" />}
              </li>
            </ul>

            {/* Right Icons */}
            <div className="nav-icons">
              {/* Search */}
              <div className="search-wrapper">
                <button 
                  className={`icon-btn search-btn-wrapper ${searchOpen ? 'open' : ''}`}
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <span className="search-text">Search</span>
                </button>
                {searchOpen && (
                  <div className="search-dropdown">
                    <input 
                      type="text" 
                      placeholder="Search for products, brands..." 
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <a href="#wishlist" className="icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </a>

              {/* User Profile */}
              <a href="#profile" className="icon-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </a>

              {/* Cart */}
              <a href="#cart" className="icon-btn cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="badge">0</span>
              </a>

              {/* Brand Logo */}
              <div className="brand-logo">
                <div className="logo-box">AB</div>
                <div className="brand-text">
                  <div className="brand-name">ADITYA BIRLA</div>
                  <div className="brand-sub">FASHION</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
