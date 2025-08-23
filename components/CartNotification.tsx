import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { CloseIcon } from './icons';

const CartNotification: React.FC = () => {
  const { notification, clearNotification, toggleCart, cartCount, cart } = useCart();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) {
    return null;
  }

  const handleViewCart = () => {
    toggleCart();
    clearNotification();
  };
  
  const handleCheckout = () => {
    clearNotification();
    if(cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl;
    }
  }

  return (
    <div className="fixed top-24 right-4 sm:right-6 lg:right-8 z-50 w-full max-w-sm">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-white rounded-lg shadow-2xl p-4 animate-fade-in-right">
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <p className="font-semibold text-lg text-green-400">Success!</p>
                    <p className="text-gray-300">{notification}</p>
                </div>
                <button onClick={clearNotification} className="ml-4 text-gray-400 hover:text-white transition-colors flex-shrink-0">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="mt-4 flex gap-3">
                <button
                    onClick={handleViewCart}
                    className="flex-1 text-center px-4 py-2 font-semibold rounded-md transition-colors bg-slate-800 text-white hover:bg-slate-700"
                >
                    View Cart ({cartCount})
                </button>
                <button
                    onClick={handleCheckout}
                    disabled={!cart?.checkoutUrl}
                    className="flex-1 text-center px-4 py-2 font-semibold rounded-md transition-colors bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Checkout
                </button>
            </div>
        </div>
    </div>
  );
};

export default CartNotification;