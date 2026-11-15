import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FREE_DELIVERY_THRESHOLD, 
  DEFAULT_DELIVERY_FEE, 
  calculateDeliveryFee, 
  checkDeliveryEligibility,
  isSinglePieceVariant 
} from '../utils/deliveryCalculator';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('c2e_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('c2e_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product, selectedVariant, quantity = 1) => {
    setCartItems((prevItems) => {
      const itemKey = `${product._id}_${selectedVariant.sku || selectedVariant.flavour + '_' + selectedVariant.boxSize}`;
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        // Check variant stock limits
        const maxStock = selectedVariant.stock || 999;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [
          ...prevItems,
          {
            key: itemKey,
            productId: product._id,
            productName: product.name,
            productImage: product.images?.[0] || '',
            flavour: selectedVariant.flavour,
            boxSize: selectedVariant.boxSize,
            sku: selectedVariant.sku,
            price: selectedVariant.price,
            stock: selectedVariant.stock || 999,
            quantity: Math.min(quantity, selectedVariant.stock || 999),
          },
        ];
      }
    });
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          const validQty = Math.min(quantity, item.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = FREE_DELIVERY_THRESHOLD;
  const shippingFee = calculateDeliveryFee(subtotal, DEFAULT_DELIVERY_FEE, freeShippingThreshold);
  const totalAmount = subtotal + shippingFee;
  const deliveryStatus = checkDeliveryEligibility(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shippingFee,
        totalAmount,
        freeShippingThreshold,
        deliveryStatus,
        isDeliveryEligible: deliveryStatus.eligible,
        deliveryIneligibleReason: deliveryStatus.message,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
