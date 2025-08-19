import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import type { ShopifyCartLine } from '../types';

const CheckoutPage: React.FC = () => {
  const { cart } = useCart();

  const cartItems = cart?.lines.edges.map(edge => edge.node) || [];
  const cartTotal = parseFloat(cart?.cost.subtotalAmount.amount || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This is a demo. Order placement is not implemented.");
  };

  const getCustomizationImage = (item: ShopifyCartLine): string => {
    const attr = item.attributes.find(attr => attr.key === '_customizationImage');
    return attr?.value || '';
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-playfair">Your Cart is Empty</h1>
        <p className="mt-4 text-lg text-gray-400">You can't check out with an empty cart!</p>
        <Link to="/shop" className="mt-6 inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-playfair text-center mb-10">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="bg-gray-800 p-8 rounded-lg order-last lg:order-first">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <img src={getCustomizationImage(item)} alt="custom item" className="w-16 h-16 rounded-md object-cover bg-gray-700" />
                    <div>
                        <p className="font-semibold">{item.merchandise.product.title}</p>
                        <p className="text-sm text-gray-400">{item.merchandise.title}</p>
                        {item.quantity > 1 && <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>}
                    </div>
                </div>
                <p className="font-semibold">${(parseFloat(item.merchandise.price.amount) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-6 space-y-2">
             <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>$5.00</span>
            </div>
             <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-2 mt-2">
                <span>Total</span>
                <span>${(cartTotal + 5.00).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Shipping Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold">Shipping Information</h2>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input type="email" id="email" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3" />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" id="name" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
              <input type="text" id="address" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300">City</label>
                    <input type="text" id="city" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3" />
                </div>
                 <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-300">State / Province</label>
                    <input type="text" id="state" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3" />
                </div>
                 <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-300">ZIP / Postal Code</label>
                    <input type="text" id="zip" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3" />
                </div>
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-lg font-semibold">
              Place Order (Demo)
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;