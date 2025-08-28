import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartIcon, MenuIcon, CloseIcon } from './icons';

const Header: React.FC = () => {
  const { toggleCart, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/shop', text: 'Shop' },
    { to: '/coaster-customizer', text: 'Coaster Customizer' },
    { to: '/about', text: 'About' },
    { to: '/custom-form', text: 'Bulk/Custom Quote' },
    { to: '/contact', text: 'Contact' },
  ];

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `nav-link-underline ${isActive ? 'active text-indigo-400' : 'hover:text-indigo-400'}`;

  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-sm shadow-lg py-2 w-full z-40 sticky top-0">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 md:h-32">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                className="h-20 md:h-24 w-auto object-contain" 
                src="https://raw.githubusercontent.com/TomVercitti/luxcribe-website/main/64_White%20Black%20Modern%20Initial%20Logo-Transparent.png" 
                alt="Luxcribe Logo" 
              />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-12">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={({isActive}) => `${linkClasses({isActive})} text-lg`}>
                {link.text}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleCart}
              className="relative text-gray-300 hover:text-indigo-400 transition-colors mr-4"
              aria-label="Open shopping cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open main menu">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 bg-opacity-90">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map(link => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({isActive}) => `${linkClasses({isActive})} block px-3 py-2 rounded-md text-base font-medium`} 
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;