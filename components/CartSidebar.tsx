import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CloseIcon, TrashIcon, Spinner } from './icons';
import type { ShopifyCartLine } from '../types';

const CartSidebar: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, isLoading } = useCart();
  
  const lineItems = cart?.lines.edges.map(edge => edge.node) || [];

  const getCustomizationImage = (item: ShopifyCartLine): string => {
    const attr = item.attributes.find(attr => attr.key === '_customizationImage');
    return attr?.value || ''; // Return a placeholder if not found
  };
  
  const getCustomizedZones = (item: ShopifyCartLine): string => {
    const attr = item.attributes.find(attr => attr.key === '_customizedZones');
    return attr?.value || 'N/A';
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 id="cart-heading" className="text-xl font-playfair text-white">Shopping Cart</h2>
            <button onClick={toggleCart} className="text-gray-400 hover:text-white transition-colors" aria-label="Close cart">
              <CloseIcon />
            </button>
          </div>

          {isLoading && lineItems.length === 0 ? (
             <div className="flex-grow flex items-center justify-center">
                <Spinner />
             </div>
          ) : lineItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-400">Your cart is empty.</p>
              <Link to="/shop" onClick={toggleCart} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-grow overflow-y-auto p-6">
                <ul className="space-y-4">
                  {lineItems.map(item => (
                    <li key={item.id} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                      <img src={getCustomizationImage(item)} alt="Customized product" className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-700" />
                      <div className="flex-grow">
                        <p className="font-semibold text-white">{item.merchandise.product.title}</p>
                        <p className="text-sm text-gray-400">{item.merchandise.title}</p>
                        <p className="text-sm text-gray-400">Zones: {getCustomizedZones(item)}</p>
                        <p className="mt-2 text-lg font-semibold text-indigo-400">${parseFloat(item.merchandise.price.amount).toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors" aria-label={`Remove ${item.merchandise.product.title} from cart`}>
                        <TrashIcon className="w-5 h-5"/>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-t border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-gray-300">Subtotal</span>
                  <span className="text-2xl font-semibold text-white">
                    ${parseFloat(cart?.cost.subtotalAmount.amount || '0').toFixed(2)}
                  </span>
                </div>
                <a href={cart?.checkoutUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center">
                  <button 
                    className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={!cart?.checkoutUrl || isLoading}
                  >
                    {isLoading ? <Spinner className="w-6 h-6 mx-auto" /> : 'Proceed to Checkout'}
                  </button>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;