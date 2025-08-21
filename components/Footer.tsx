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
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.27 1.217.64 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122s-.013 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06s-3.056-.013-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12s.013-3.056.06-4.122c.05-1.065.218-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.8c-2.69 0-3.02.01-4.075.058-.975.045-1.502.207-1.858.344-.45.18-.76.395-1.126.758-.365.365-.578.675-.758 1.126-.137.356-.3.883-.344 1.858-.048 1.055-.058 1.385-.058 4.075s.01 3.02.058 4.075c.045.975.207 1.502.344 1.858.18.45.395.76.758 1.126.365.365.675.578 1.126.758.356.137.883.3 1.858.344 1.055.048 1.385.058 4.075.058s3.02-.01 4.075-.058c.975-.045 1.502-.207 1.858-.344.45-.18.76-.395 1.126-.758.365-.365.578-.675.758-1.126.137-.356.3-.883.344-1.858.048-1.055.058-1.385.058-4.075s-.01-3.02-.058-4.075c-.045-.975-.207-1.502-.344-1.858-.18-.45-.395-.76-.758-1.126-.365-.365-.675-.578-1.126-.758-.356-.137-.883-.3-1.858-.344-1.055-.048-1.385-.058-4.075-.058zM12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm5.338-9.87a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" clipRule="evenodd" /></svg></a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.85 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.73,18.78 17.93,18.84C17.13,18.91 16.44,18.94 15.84,18.94L15,19C12.81,19 11.15,18.84 10.17,18.56C9.27,18.31 8.69,17.73 8.44,16.83C8.31,16.36 8.22,15.73 8.16,14.93C8.09,14.13 8.06,13.44 8.06,12.84L8,12C8,9.81 8.16,8.15 8.44,7.17C8.69,6.27 9.27,5.69 10.17,5.44C11.15,5.16 12.81,5 15,5L15.84,5.06C16.44,5.06 17.13,5.09 17.93,5.16C18.73,5.22 19.36,5.31 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" /></svg></a>
              <a href="#" aria-label="TikTok" className="text-gray-400 hover:text-white"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525 2h-1.99c-.414 0-.75.336-.75.75v11.664a3.81 3.81 0 0 1-3.785 3.836A3.836 3.836 0 0 1 2.164 14.5a3.81 3.81 0 0 1 3.785-3.836c.264 0 .52.027.77.082v-1.98c-.24-.04-.49-.062-.75-.062a5.796 5.796 0 0 0-5.785 5.816 5.816 5.816 0 0 0 5.815 5.786A5.796 5.796 0 0 0 11.5 14.414V2.75A.75.75 0 0 1 12.25 2h.275a6.002 6.002 0 0 0 5.925 5.234v-1.98A4.002 4.002 0 0 1 12.525 2z" /></svg></a>
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