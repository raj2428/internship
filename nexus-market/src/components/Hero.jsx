import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Hero() {
  const { navigateTo, setActiveCategory } = useShop();

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigateTo('catalog');
  };

  const categories = [
    { id: 'audio', label: 'Audio Tech', icon: '🎧' },
    { id: 'wearables', label: 'Wearables', icon: '⌚' },
    { id: 'keyboards', label: 'Keyboards', icon: '⌨️' },
    { id: 'charging', label: 'Power Stations', icon: '⚡' },
    { id: 'smart-home', label: 'Smart Living', icon: '🏠' }
  ];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 0 3rem 0', background: 'var(--bg-primary)' }}>
      {/* Background Animated Gradient Mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 10% 20%, rgba(155, 81, 235, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(0, 245, 245, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(245, 166, 35, 0.04) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="section-container animate-fade" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--accent-cyan)',
            marginBottom: '1.5rem'
          }}
        >
          <span style={{ width: '20px', height: '1px', background: 'var(--accent-cyan)' }} />
          <span>Next-Generation Gear</span>
          <span style={{ width: '20px', height: '1px', background: 'var(--accent-cyan)' }} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(to right, #fff 40%, var(--text-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
          }}
        >
          Gear Up For The <br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Digital Frontier
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto',
            fontWeight: 400,
            lineHeight: 1.75
          }}
        >
          Explore NexusMarket's curated catalog of high-performance electronics, smart wearables, and artisanal typing gear. Engineered for enthusiasts, optimized for speed.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <button onClick={() => navigateTo('catalog')} className="btn btn-primary" style={{ padding: '0.9rem 2.25rem' }}>
            <span>Explore Catalog</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Categories Jump List */}
        <div style={{ marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '1.25rem' }}>
            Quick jump to category
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="btn btn-secondary"
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1.5rem',
            maxWidth: '860px',
            margin: '0 auto'
          }}
        >
          <div>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>9+</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Premium Gadgets</span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }} className="stat-middle">
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>48h</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Express Dispatch</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>100%</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secure Checkout</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .stat-middle {
            border-left: none !important;
            border-right: none !important;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
          }
        }
      `}</style>
    </section>
  );
}
