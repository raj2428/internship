import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export default function ProductDetail() {
  const { route, products, addToCart, navigateTo } = useShop();
  const [quantity, setQuantity] = useState(1);

  // Find current product
  const product = products.find(p => p.id === route.productId);

  // Reset quantity when active product changes
  useEffect(() => {
    setQuantity(1);
  }, [route.productId]);

  if (!product) {
    return (
      <div className="section-container animate-fade" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>Gear Not Found</h2>
        <button onClick={() => navigateTo('catalog')} className="btn btn-primary">
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleDecreaseQty = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity(prev => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product.id, quantity);
      alert(`Successfully added ${quantity}x ${product.name} to your cart!`);
    }
  };

  // Find related products (same category, excluding current product, limit 3)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="section-container animate-fade" style={{ padding: '2rem var(--space-sm)' }}>
      {/* Back Link */}
      <button
        onClick={() => navigateTo('catalog')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--accent-cyan)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
          fontSize: '0.88rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '2rem',
          padding: 0
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Catalog</span>
      </button>

      {/* Main Details Section */}
      <div className="product-detail-grid">
        
        {/* Left Column: Image Frame */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: 'auto', maxHeight: '550px', objectFit: 'cover' }}
          />
          {isOutOfStock && (
            <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(235, 87, 87, 0.95)', color: '#fff', fontSize: '0.8rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sold Out
            </span>
          )}
        </div>

        {/* Right Column: Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header */}
          <div>
            <span style={{ display: 'inline-block', color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
              {product.category}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem', lineHeight: 1.15 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 500, fontStyle: 'italic' }}>
              {product.tagline}
            </p>
          </div>

          {/* Rating, Price & Stock Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              ${product.price}
            </span>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ display: 'flex', gap: '0.1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? 'var(--accent-amber)' : 'none'} stroke="var(--accent-amber)" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '0.2rem' }}>
                {product.rating}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ({product.reviewsCount} verified reviews)
              </span>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

            {/* Inventory Status */}
            <div>
              {isOutOfStock ? (
                <span style={{ color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.9rem' }}>Dispatched Unavailable</span>
              ) : isLowStock ? (
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.9rem' }}>Low Stock: Only {product.stock} items left!</span>
              ) : (
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>In Stock: Ready to ship</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>Overview</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.75 }}>
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart Controls */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', height: '46px' }}>
                <button
                  onClick={handleDecreaseQty}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '40px', height: '100%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  −
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '0.95rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQty}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '40px', height: '100%', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ height: '46px', padding: '0 2.5rem', flexGrow: 1, maxWidth: '280px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specifications & Reviews Tabs Layout */}
      <div className="product-extra-grid" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        
        {/* Specifications */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem', color: '#fff' }}>
            Technical Specifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{key}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', color: '#fff' }}>
            Customer Reviews
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {product.reviews.map((rev, index) => (
              <div key={index} style={{ borderBottom: index < product.reviews.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: index < product.reviews.length - 1 ? '1.25rem' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{rev.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem', marginBottom: '0.5rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < rev.rating ? 'var(--accent-amber)' : 'none'} stroke="var(--accent-amber)" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Row */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.75rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            You May Also Like
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {relatedProducts.map(p => (
              <div
                key={p.id}
                onClick={() => navigateTo('detail', p.id)}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                className="related-card"
              >
                <div style={{ height: '160px', width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', marginBottom: '0.75rem' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>{p.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>${p.price}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--accent-amber)" stroke="var(--accent-amber)">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 700 }}>{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styled JSX for media queries */}
      <style>{`
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        .related-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 245, 245, 0.2);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        @media (min-width: 992px) {
          .product-detail-grid {
            grid-template-columns: 1.1fr 0.9fr;
          }
          .product-extra-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
