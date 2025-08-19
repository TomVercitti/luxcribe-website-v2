import React from 'react';
import { Link } from 'react-router-dom';
import ShopifyStatusIndicator from './ShopifyStatusIndicator';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] border-t border-gray-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Customer Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
              <li><Link to="/track-order" className="hover:text-white">Track Your Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Our Policies</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/shipping" className="hover:text-white">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* Placeholder for social icons */}
              <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 4.525c.636-.247 1.363.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm0 1.62c-2.403 0-2.748.01-3.727.058-1.22.057-2.007.248-2.722.533-.749.293-1.344.698-1.942 1.294a3.284 3.284 0 00-1.294 1.941c-.285.715-.476 1.502-.533 2.722-.048.979-.058 1.323-.058 3.727s.01 2.748.058 3.727c.057 1.22.248 2.007.533 2.722.293.749.698 1.344 1.294 1.942a3.284 3.284 0 001.941 1.294c.715.285 1.502.476 2.722.533.979.048 1.323.058 3.727.058s2.748-.01 3.727-.058c1.22-.057 2.007-.248 2.722-.533.749-.293 1.344.698 1.942-1.294a3.284 3.284 0 001.294-1.941c.285-.715.476-1.502.533-2.722.048-.979.058-1.323-.058-3.727s-.01-2.748-.058-3.727c-.057-1.22-.248-2.007-.533-2.722-.293-.749-.698-1.344-1.294-1.942a3.284 3.284 0 00-1.941-1.294c-.715-.285-1.502-.476-2.722-.533-.979-.048-1.323-.058-3.727-.058z" clipRule="evenodd" /></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-center text-gray-500">
              <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Luxcribe. All rights reserved.</p>
              <ShopifyStatusIndicator />
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;