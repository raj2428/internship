import React from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    sortBy,
    setSortBy
  } = useShop();

  const categories = [
    { id: 'all', label: 'All Gear' },
    { id: 'audio', label: 'Audio Tech' },
    { id: 'wearables', label: 'Wearables' },
    { id: 'keyboards', label: 'Keyboards' },
    { id: 'charging', label: 'Charging' },
    { id: 'smart-home', label: 'Smart Home' }
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setPriceRange([0, 500]);
    setMinRating(0);
    setSortBy('default');
  };

  return (
    <div className="section-container animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', padding: '2rem var(--space-sm)' }}>
      
      {/* Page Title & Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase' }}>
            Product Catalog
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredProducts.length} of {filteredProducts.length === 1 ? '1 premium item' : `${filteredProducts.length} premium items`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
            style={{ padding: '0.4rem 1.75rem 0.4rem 0.75rem', fontSize: '0.85rem', height: '34px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="catalog-layout">
        
        {/* Filters Sidebar */}
        <aside className="filters-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', color: '#fff' }}>Filters</h3>
            <button
              onClick={resetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              Reset All
            </button>
          </div>

          {/* Search bar inside sidebar for mobile */}
          <div className="mobile-only-filter" style={{ display: 'none' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>Search</h4>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search premium gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.25rem', fontSize: '0.85rem', height: '34px' }}
              />
              <svg style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>Category</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    background: activeCategory === cat.id ? 'rgba(0, 245, 245, 0.08)' : 'transparent',
                    border: 'none',
                    color: activeCategory === cat.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontWeight: activeCategory === cat.id ? 700 : 500,
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  className="category-btn"
                >
                  <span>{cat.label}</span>
                  {activeCategory === cat.id && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>Price Range</span>
              <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', textTransform: 'none' }}>Up to ${priceRange[1]}</span>
            </h4>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              style={{
                width: '100%',
                accentColor: 'var(--accent-cyan)',
                background: 'var(--bg-tertiary)',
                height: '5px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>$0</span>
              <span>$500</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>Minimum Rating</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[0, 4.5, 4.7, 4.8].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() => setMinRating(ratingVal)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: minRating === ratingVal ? 'var(--accent-cyan)' : 'var(--border-color)',
                    background: minRating === ratingVal ? 'rgba(0, 245, 245, 0.08)' : 'transparent',
                    color: minRating === ratingVal ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {ratingVal === 0 ? 'All' : `${ratingVal}★+`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="grid-content">
          {filteredProducts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              className="animate-scale"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '5rem 2rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Gear Matches Your Search</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                We couldn't find any products matching your current combination of filters. Try clearing your filters or widening your criteria.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Clear Filters & Show All
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Styled JSX for media queries */}
      <style>{`
        .catalog-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .category-btn:hover {
          background: rgba(255,255,255,0.03);
          color: var(--text-primary);
        }
        @media (min-width: 992px) {
          .catalog-layout {
            grid-template-columns: 280px 1fr;
          }
        }
      `}</style>
    </div>
  );
}
