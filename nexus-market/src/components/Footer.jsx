import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { navigateTo } = useShop();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', marginTop: 'auto', padding: '4rem 0 2rem 0' }}>
      <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', paddingBottom: '3rem' }}>
        
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L30 10V22L16 30L2 22V10L16 2Z" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M16 8L25 13V19L16 24L7 19V13L16 8Z" fill="var(--accent-purple)" opacity="0.4" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#fff' }}>
              NEXUS<span style={{ color: 'var(--accent-cyan)' }}>MARKET</span>
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '240px' }}>
            Premium e-commerce catalog featuring high-performance typing, audio, and wearable hardware.
          </p>
          {/* Social Links */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            {/* GitHub */}
            <a
              href="https://github.com/rajkumarprasad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              style={{ width: '34px', height: '34px', borderRadius: '50%' }}
              aria-label="GitHub Profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/rajkumarprasad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              style={{ width: '34px', height: '34px', borderRadius: '50%' }}
              aria-label="LinkedIn Profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

        {/* Directory Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Store Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li>
              <button onClick={() => navigateTo('home')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }} className="footer-link">
                Home Base
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('catalog')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }} className="footer-link">
                Product Catalog
              </button>
            </li>
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="footer-link">
                Fulfillment FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Customer Care
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="footer-link">Fulfillment Info</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="footer-link">Return Standards</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="footer-link">Secure Invoicing</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="footer-link">Help & Contact</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            Newsletter Dispatch
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
            Subscribe to receive stock drops, hardware updates, and member discounts.
          </p>
          {subscribed ? (
            <div className="animate-fade" style={{ background: 'rgba(0, 245, 245, 0.08)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', fontWeight: 700 }}>
              Subscription Confirmed! Welcome aboard.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter email address..."
                style={{ flexGrow: 1, fontSize: '0.85rem', height: '36px', padding: '0 0.75rem', borderRadius: 'var(--radius-xs)' }}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem', height: '36px', fontSize: '0.8rem' }}>
                Join
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Copyright Footer Row */}
      <div className="section-container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <span>&copy; {new Date().getFullYear()} NexusMarket Corp. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Terms of Service</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Privacy Standards</a>
        </div>
      </div>

      <style>{`
        .footer-link {
          transition: var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--accent-cyan) !important;
        }
      `}</style>
    </footer>
  );
}
