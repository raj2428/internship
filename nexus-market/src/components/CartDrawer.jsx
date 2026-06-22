import React from 'react';
import { useShop } from '../context/ShopContext';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTax,
    shippingFee,
    cartTotal,
    navigateTo
  } = useShop();

  if (!isOpen) return null;

  const handleQtyChange = (item, newQty) => {
    if (newQty <= 0) {
      removeFromCart(item.product.id, item.spec);
    } else {
      updateCartQuantity(item.product.id, newQty, item.spec);
    }
  };

  const handleCheckoutClick = () => {
    onClose();
    navigateTo('checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      {/* Backdrop Backdrop with Blur */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 7, 12, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
      />

      {/* Drawer Body Panel */}
      <div
        className="animate-slide"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2100,
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', color: '#fff' }}>
            Shopping Cart
          </h3>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ borderRadius: '50%', width: '36px', height: '36px' }}
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Scrollable Item List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                {/* Thumb */}
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-tertiary)', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info & Adjusters */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{item.product.name}</h4>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                        ${item.product.price}
                      </span>
                    </div>
                    {item.spec && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Spec: {item.spec}</p>
                    )}
                  </div>

                  {/* Quantity and Remove row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    {/* Qty changer */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', height: '30px' }}>
                      <button
                        onClick={() => handleQtyChange(item, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '26px', height: '100%', cursor: 'pointer', fontWeight: 700 }}
                      >
                        −
                      </button>
                      <span style={{ width: '28px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '26px', height: '100%', cursor: 'pointer', fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>

                    {/* Trash */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.spec)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                      className="trash-btn"
                      aria-label="Remove item"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty state */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%', textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Your Cart is Empty</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '240px', marginBottom: '1.5rem' }}>
                You haven't added any premium gadgets to your cart yet.
              </p>
              <button
                onClick={() => { onClose(); navigateTo('catalog'); }}
                className="btn btn-outline-cyan"
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}
              >
                Go to Catalog
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Pricing & CTA */}
        {cart.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: shippingFee === 0 ? 'var(--accent-cyan)' : '#fff', fontWeight: 600 }}>
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <span>Sales Tax (8%)</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${cartTax.toFixed(2)}</span>
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
            >
              <span>Proceed to Checkout</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .trash-btn:hover {
          color: var(--accent-rose) !important;
        }
      `}</style>
    </div>
  );
}
