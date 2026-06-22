import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import CheckoutFlow from './components/CheckoutFlow';
import Footer from './components/Footer';

function MainAppContent() {
  const { route, products, navigateTo } = useShop();
  const [cartOpen, setCartOpen] = useState(false);

  // Home Page Featured Section (Take first 3 products for display)
  const featuredProducts = products.slice(0, 3);

  const renderView = () => {
    switch (route.path) {
      case 'home':
        return (
          <>
            <Hero />
            
            {/* Featured Section */}
            <section style={{ background: 'var(--bg-primary)', padding: '4rem 0' }}>
              <div className="section-container animate-fade">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-purple)' }}>
                    Curated Picks
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', color: '#fff' }}>
                    Featured Hardware
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
                    A handpicked selection of our most popular high-performance electronics and tactical desk accessories.
                  </p>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* View All Button */}
                <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="btn btn-outline-cyan"
                    style={{ padding: '0.8rem 2.25rem' }}
                  >
                    <span>View Full Catalog</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </>
        );
      case 'catalog':
        return <ProductGrid />;
      case 'detail':
        return <ProductDetail />;
      case 'checkout':
        return <CheckoutFlow />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '10rem 0' }}>
            <h2>404 - View Not Found</h2>
            <button onClick={() => navigateTo('home')} className="btn btn-primary">Return Home</button>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* Header Sticky Navigation */}
      <Navbar onOpenCart={() => setCartOpen(true)} />

      {/* Main Container */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Sliding Tray Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Page Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
