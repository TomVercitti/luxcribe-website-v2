import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import type { CartItem, ShopifyCart } from '../types';
import { createCart, fetchCart, addLinesToCart, removeLinesFromCart } from '../services/shopify';

const SHOPIFY_CART_ID_KEY = 'shopify_cart_id';

interface CartContextType {
  cart: ShopifyCart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  notification: string | null;
  initializationError: string | null;
  addToCart: (items: CartItem[]) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  toggleCart: () => void;
  clearNotification: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately
  const [notification, setNotification] = useState<string | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      setInitializationError(null);
      try {
        const existingCartId = localStorage.getItem(SHOPIFY_CART_ID_KEY);
        let newCart: ShopifyCart | null = null;

        if (existingCartId) {
          newCart = await fetchCart(existingCartId);
          // If the cart was completed or expired, it will return null
          if (!newCart) {
             console.log("Existing cart not found, creating a new one.");
             localStorage.removeItem(SHOPIFY_CART_ID_KEY);
          }
        }
        
        if (!newCart) {
          newCart = await createCart();
        }

        if (newCart) {
            localStorage.setItem(SHOPIFY_CART_ID_KEY, newCart.id);
            setCart(newCart);
        } else {
            // This case might happen if createCart returns null unexpectedly
            throw new Error("Failed to create or fetch a new cart.");
        }
      } catch (error: any) {
        console.error("Error initializing cart:", error);
        const friendlyMessage = (error.message || 'An unknown error occurred').replace('Shopify GraphQL Error: ', '').replace('Shopify Error: ', '');
        setInitializationError(`Could not connect to the shop. ${friendlyMessage}`);
        localStorage.removeItem(SHOPIFY_CART_ID_KEY); // Clear bad ID
      } finally {
        setIsLoading(false);
      }
    };
    initializeCart();
  }, []);

  const addToCart = async (items: CartItem[]) => {
    if (!cart?.id) {
        const err = "Cart not available. This might be due to a connection issue.";
        console.error(err);
        throw new Error(err);
    }
    setIsLoading(true);
    try {
        const newCart = await addLinesToCart(cart.id, items);
        if (newCart) {
            setCart(newCart);
            setNotification('Item successfully added to cart!');
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error; // Re-throw error to be caught by the calling component
    } finally {
        setIsLoading(false);
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    if (!cart?.id) {
      console.error("Cart not available");
      return;
    }
    setIsLoading(true);

    try {
      const allLines = cart.lines.edges.map(edge => edge.node);
      const lineToRemove = allLines.find(line => line.id === lineItemId);

      if (!lineToRemove) {
        console.warn("Line to remove not found in cart.");
        setIsLoading(false);
        return;
      }

      const lineIdsToRemove: string[] = [lineItemId];

      // Check if the removed item is the main customized product
      const isParentAttribute = lineToRemove.attributes.find(
        attr => attr.key === '_isCustomizedParent' && attr.value === 'true'
      );
      
      if (isParentAttribute) {
        const bundleIdAttribute = lineToRemove.attributes.find(attr => attr.key === '_customizationBundleId');
        const bundleId = bundleIdAttribute?.value;

        if (bundleId) {
          // Find all associated fee lines with the same bundle ID
          allLines.forEach(line => {
            // Make sure we don't re-add the parent
            if (line.id !== lineItemId) {
              const lineBundleAttr = line.attributes.find(
                attr => attr.key === '_customizationBundleId' && attr.value === bundleId
              );
              if (lineBundleAttr) {
                lineIdsToRemove.push(line.id);
              }
            }
          });
        }
      }
      
      const newCart = await removeLinesFromCart(cart.id, lineIdsToRemove);
      if (newCart) {
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const cartCount = useMemo(() => 
    cart?.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0) || 0,
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, isCartOpen, isLoading, notification, initializationError, addToCart, removeFromCart, toggleCart, clearNotification, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};