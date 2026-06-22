import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CheckoutFlow() {
  const { cart, cartSubtotal, cartTax, shippingFee, cartTotal, clearCart, navigateTo } = useShop();

  // Checkout Wizard Step: 1 = Shipping, 2 = Payment, 3 = Success
  const [step, setStep] = useState(1);

  // Form Fields State
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Validation Errors
  const [errors, setErrors] = useState({});
  const [orderId] = useState(() => `NEXUS-${Math.floor(100000 + Math.random() * 900000)}`);

  // Handle Input Changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Premium Input Formatting Actions
    if (name === 'cardNumber') {
      // Remove non-digits and add spaces every 4 characters
      const clean = value.replace(/\D/g, '').slice(0, 16);
      const matches = clean.match(/\d{1,4}/g);
      formattedValue = matches ? matches.join(' ') : '';
    } else if (name === 'cardExpiry') {
      // MM/YY format auto-slashing
      const clean = value.replace(/\D/g, '').slice(0, 4);
      if (clean.length > 2) {
        formattedValue = `${clean.slice(0, 2)}/${clean.slice(2)}`;
      } else {
        formattedValue = clean;
      }
    } else if (name === 'cardCvv') {
      // Limit CVV to 3 digits
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Step 1: Shipping Validation
  const validateShipping = () => {
    const newErrors = {};
    if (!shippingData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!emailPattern.test(shippingData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!shippingData.address.trim()) newErrors.address = 'Shipping Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    
    const zipPattern = /^\d{5,6}$/;
    if (!shippingData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP Code is required';
    } else if (!zipPattern.test(shippingData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5 or 6 digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2: Payment Validation
  const validatePayment = () => {
    const newErrors = {};
    if (!paymentData.cardName.trim()) newErrors.cardName = 'Cardholder Name is required';
    
    const cleanCard = paymentData.cardNumber.replace(/\s/g, '');
    if (cleanCard.length !== 16) {
      newErrors.cardNumber = 'Card number must be exactly 16 digits';
    }

    const cleanExpiry = paymentData.cardExpiry.replace('/', '');
    if (cleanExpiry.length !== 4) {
      newErrors.cardExpiry = 'Expiry date must be in MM/YY format';
    } else {
      const month = parseInt(cleanExpiry.slice(0, 2));
      const year = parseInt(cleanExpiry.slice(2));
      if (month < 1 || month > 12) {
        newErrors.cardExpiry = 'Invalid month';
      }
    }

    if (paymentData.cardCvv.length !== 3) {
      newErrors.cardCvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep(3);
    }
  };

  const handleSuccessFinished = () => {
    clearCart();
    navigateTo('home');
  };

  // Empty state checkout check
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="section-container animate-fade" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You cannot checkout with an empty cart.</p>
        <button onClick={() => navigateTo('catalog')} className="btn btn-primary">
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="section-container animate-fade" style={{ maxWidth: '1000px', padding: '2rem var(--space-sm)' }}>
      
      {/* Checkout Steps Tracker (Visible for step 1 & 2) */}
      {step < 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: step === 1 ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' : 'var(--bg-tertiary)',
              color: step === 1 ? 'hsl(222, 40%, 4%)' : 'var(--text-secondary)',
              fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>1</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: step === 1 ? 'var(--accent-cyan)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Shipping
            </span>
          </div>
          <div style={{ width: '60px', height: '2px', background: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: step === 2 ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' : 'var(--bg-tertiary)',
              color: step === 2 ? 'hsl(222, 40%, 4%)' : 'var(--text-secondary)',
              fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>2</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: step === 2 ? 'var(--accent-cyan)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Payment
            </span>
          </div>
        </div>
      )}

      <div className="checkout-layout">
        
        {/* Step 1 & 2 Form Controls */}
        {step < 3 && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
            
            {/* Step 1: Shipping Info */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', color: '#fff' }}>
                  Shipping Information
                </h3>
                
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleShippingChange}
                    className="form-input"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleShippingChange}
                    className="form-input"
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    className="form-input"
                    placeholder="123 Cyber Way"
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="Neo City"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                      className="form-input"
                      placeholder="94016"
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', marginTop: '1.5rem' }}>
                  <span>Continue to Payment</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            )}

            {/* Step 2: Payment Info */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', color: '#fff' }}>
                  Payment Details
                </h3>

                <div className="input-group">
                  <label className="input-label">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                    className="form-input"
                    placeholder="JOHN DOE"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    className="form-input"
                    placeholder="4111 2222 3333 4444"
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={paymentData.cardExpiry}
                      onChange={handlePaymentChange}
                      className="form-input"
                      placeholder="MM/YY"
                    />
                    {errors.cardExpiry && <span className="error-text">{errors.cardExpiry}</span>}
                  </div>
                  <div className="input-group">
                    <label className="input-label">CVV</label>
                    <input
                      type="password"
                      name="cardCvv"
                      value={paymentData.cardCvv}
                      onChange={handlePaymentChange}
                      className="form-input"
                      placeholder="•••"
                    />
                    {errors.cardCvv && <span className="error-text">{errors.cardCvv}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flexGrow: 1 }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 2, height: '46px' }}>
                    <span>Complete Purchase</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* Order Summary Panel (Visible for step 1 & 2) */}
        {step < 3 && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem', color: '#fff' }}>
              Order Summary
            </h3>
            
            {/* Scrollable list of items being purchased */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '240px', overflowY: 'auto' }}>
              {cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', background: 'var(--bg-tertiary)', flexShrink: 0 }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{item.product.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', marginBottom: '1rem' }} />

            {/* Invoicing Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: shippingFee === 0 ? 'var(--accent-cyan)' : '#fff', fontWeight: 600 }}>
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>${cartTax.toFixed(2)}</span>
              </div>
              <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.4rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Checkout Success Page */}
        {step === 3 && (
          <div
            className="animate-scale"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem 2rem',
              textAlign: 'center',
              maxWidth: '650px',
              margin: '0 auto'
            }}
          >
            {/* Animated Draw Checkmark SVG */}
            <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 245, 245, 0.08)', border: '2px solid var(--accent-cyan)', marginBottom: '1.5rem', position: 'relative' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline
                  points="20 6 9 17 4 12"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50,
                    animation: 'checkmarkDraw 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards'
                  }}
                />
              </svg>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
              Order Completed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              Thank you for shopping with NexusMarket. Your payment has processed successfully, and our fulfillment units are preparing your dispatch.
            </p>

            {/* Order Confirmation Receipt Block */}
            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span>Confirmation details</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Deliver to:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{shippingData.fullName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email copy to:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{shippingData.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Invoice Charged:</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button onClick={handleSuccessFinished} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
              Return Home
            </button>
          </div>
        )}

      </div>

      {/* Styled JSX for media queries */}
      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (min-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1.25fr 0.75fr;
          }
        }
      `}</style>
    </div>
  );
}
