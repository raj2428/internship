import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Products
  const [products] = useState(initialProducts);

  // Cart State (loaded from localStorage if present)
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('nexus_cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
  }, [cart]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');

  // Client-Side Routing State
  // Format: { path: 'home' | 'catalog' | 'detail' | 'checkout', productId?: string }
  const [route, setRoute] = useState(() => {
    // Parse current URL hash on initial load if available
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('product/')) {
      const productId = hash.replace('product/', '');
      return { path: 'detail', productId };
    } else if (hash === 'catalog' || hash === 'checkout') {
      return { path: hash };
    }
    return { path: 'home' };
  });

  // Handle URL change (Back / Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('product/')) {
        const productId = hash.replace('product/', '');
        setRoute({ path: 'detail', productId });
      } else if (hash === 'catalog' || hash === 'checkout') {
        setRoute({ path: hash });
      } else {
        setRoute({ path: 'home' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Helper
  const navigateTo = (path, productId = null) => {
    let hash = '';
    if (path === 'detail' && productId) {
      hash = `#product/${productId}`;
    } else if (path !== 'home') {
      hash = `#${path}`;
    }
    
    window.history.pushState(null, '', hash || window.location.pathname + window.location.search);
    setRoute({ path, productId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const addToCart = (productId, quantity = 1, spec = null) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === productId && item.spec === spec
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingItemIndex].quantity + quantity;
        
        // Cap quantity at stock
        newCart[existingItemIndex].quantity = Math.min(newQty, product.stock);
        return newCart;
      }

      return [...prevCart, { product, quantity: Math.min(quantity, product.stock), spec }];
    });
  };

  const removeFromCart = (productId, spec = null) => {
    setCart(prevCart => prevCart.filter(item => !(item.product.id === productId && item.spec === spec)));
  };

  const updateCartQuantity = (productId, quantity, spec = null) => {
    const product = products.find(p => p.id === productId);
    if (!product || quantity <= 0) return;

    setCart(prevCart => {
      const newCart = [...prevCart];
      const itemIndex = newCart.findIndex(
        item => item.product.id === productId && item.spec === spec
      );

      if (itemIndex > -1) {
        newCart[itemIndex].quantity = Math.min(quantity, product.stock);
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculated Cart Summaries
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTax = cartSubtotal * 0.08; // 8% sales tax
  const shippingFee = cartSubtotal > 150 || cartSubtotal === 0 ? 0 : 15;
  const cartTotal = cartSubtotal + cartTax + shippingFee;

  // Filter & Search Logic
  const filteredProducts = products.filter(product => {
    // Search query match (case-insensitive on name, tagline, description)
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    // Category match
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    // Price match
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    // Rating match
    const matchesRating = product.rating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    // Sorting logic
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default sorting (database order)
  });

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotalItems,
        cartTax,
        shippingFee,
        cartTotal,
        
        // Search & Filters
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,

        // Custom router pathing
        route,
        navigateTo
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
