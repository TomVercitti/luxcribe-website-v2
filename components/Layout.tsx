import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartNotification from './CartNotification';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-gray-200">
      <Header />
      <main key={location.pathname} className="flex-grow fade-in">
        <Outlet />
      </main>
      <Footer />
      <CartNotification />
    </div>
  );
};

export default Layout;