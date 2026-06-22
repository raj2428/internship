import React from 'react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart, navigateTo } = useShop();

  const handleQuickAdd = (e) => {
    e.stopPropagation(); // Avoid triggering navigation to detail page
    if (product.stock > 0) {
      addToCart(product.id, 1);
    }
  };

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <article
      onClick={() => navigateTo('detail', product.id)}
      className="glow-card"
      style={{ cursor: 'pointer' }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          height: '240px',
          width: '100%',
          overflow: 'hidden',
          background: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-smooth)'
          }}
          className="product-card-image"
        />

        {/* Floating Stock Indicator */}
        {isOutOfStock && (
          <span
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(235, 87, 87, 0.9)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(245, 166, 35, 0.9)',
              color: 'hsl(222, 40%, 4%)',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Only {product.stock} left
          </span>
        )}

        {/* Category Tag */}
        <span
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '1rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid var(--glass-border)',
            color: 'var(--accent-cyan)',
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.08em'
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Body Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 700,
            lineHeight: 1.25,
            color: '#fff',
            marginBottom: '0.4rem',
            transition: 'var(--transition-fast)'
          }}
          className="product-card-title"
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            height: '2.5rem'
          }}
        >
          {product.tagline}
        </p>

        {/* Rating and Price Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '1.25rem' }}>
          {/* Price */}
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            ${product.price}
          </span>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-amber)" stroke="var(--accent-amber)" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              {product.rating}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Quick Add CTA */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className="btn"
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            fontSize: '0.82rem',
            background: isOutOfStock
              ? 'var(--bg-tertiary)'
              : 'linear-gradient(135deg, var(--bg-tertiary), rgba(0, 245, 245, 0.05))',
            color: isOutOfStock ? 'var(--text-muted)' : 'var(--accent-cyan)',
            border: isOutOfStock ? '1px solid transparent' : '1px solid rgba(0, 245, 245, 0.25)',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
          }}
        >
          {isOutOfStock ? 'Sold Out' : 'Quick Add'}
        </button>
      </div>

      <style>{`
        .glow-card:hover .product-card-image {
          transform: scale(1.05);
        }
        .glow-card:hover .product-card-title {
          color: var(--accent-cyan) !important;
        }
      `}</style>
    </article>
  );
}
