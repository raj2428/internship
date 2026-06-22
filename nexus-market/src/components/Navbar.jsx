import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export default function Navbar({ onOpenCart }) {
  const { cartTotalItems, searchQuery, setSearchQuery, route, navigateTo } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeTrigger, setBadgeTrigger] = useState(false);

  // Monitor scroll for header shrinking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger bounce animation on cart item count change
  useEffect(() => {
    if (cartTotalItems > 0) {
      setBadgeTrigger(true);
      const t = setTimeout(() => setBadgeTrigger(false), 300);
      return () => clearTimeout(t);
    }
  }, [cartTotalItems]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If user starts typing and isn't on catalog page, push to catalog
    if (route.path !== 'catalog') {
      navigateTo('catalog');
    }
  };

  return (
    <header className={`glass-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="section-container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--space-sm)' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M16 8L25 13V19L16 24L7 19V13L16 8Z" fill="url(#logo-grad)" opacity="0.3" />
            <path d="M16 12V20" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="logo-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-purple)" />
                <stop offset="1" stopColor="var(--accent-cyan)" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
            NEXUS<span style={{ color: 'var(--accent-cyan)' }}>MARKET</span>
          </span>
        </div>

        {/* Desktop Search Bar */}
        <div className="desktop-search" style={{ position: 'relative', width: '320px', display: 'none' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search premium gear..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: '100%', paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', height: '36px' }}
          />
          <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Nav Links + Cart */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="nav-links-desktop" style={{ display: 'none', gap: '1.5rem' }}>
            <button
              onClick={() => navigateTo('home')}
              style={{ background: 'none', border: 'none', color: route.path === 'home' ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-fast)' }}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              style={{ background: 'none', border: 'none', color: route.path === 'catalog' ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', transition: 'var(--transition-fast)' }}
            >
              Catalog
            </button>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="btn-icon"
            style={{ position: 'relative', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', width: '42px', height: '42px' }}
            aria-label="Shopping Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartTotalItems > 0 && (
              <span
                className={badgeTrigger ? 'cart-pop-trigger' : ''}
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(135deg, var(--accent-rose), var(--accent-purple))',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  pointerEvents: 'none'
                }}
              >
                {cartTotalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="btn-icon mobile-menu-toggle"
            style={{ borderRadius: 'var(--radius-full)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="animate-fade"
          style={{
            position: 'absolute',
            top: scrolled ? '64px' : '72px',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          {/* Mobile Search */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search premium gear..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '100%', paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}
            />
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <button
            onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}
            style={{ background: 'none', border: 'none', color: route.path === 'home' ? 'var(--accent-cyan)' : 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0', textAlign: 'left' }}
          >
            Home
          </button>
          <button
            onClick={() => { navigateTo('catalog'); setMobileMenuOpen(false); }}
            style={{ background: 'none', border: 'none', color: route.path === 'catalog' ? 'var(--accent-cyan)' : 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0', textAlign: 'left' }}
          >
            Catalog Product Grid
          </button>
        </div>
      )}

      {/* Styled JSX for media queries */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-search { display: block !important; }
          .nav-links-desktop { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
