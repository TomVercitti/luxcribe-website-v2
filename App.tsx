import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import EditorPage from './pages/EditorPage';
import CustomFormPage from './pages/CustomFormPage';
import ContactPage from './pages/ContactPage';
import StaticContentPage from './pages/StaticContentPage';
import { pageContent } from './constants';
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSidebar';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import CoasterCustomizerPage from './pages/CoasterCustomizerPage';

const App: React.FC = () => {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="coaster-customizer" element={<CoasterCustomizerPage />} />
            <Route path="custom-form" element={<CustomFormPage />} />
            <Route path="contact" element={<ContactPage />} />
            {Object.keys(pageContent).map(pageKey => (
              <Route 
                key={pageKey}
                path={pageKey} 
                element={<StaticContentPage pageKey={pageKey as keyof typeof pageContent} />} 
              />
            ))}
          </Route>
          <Route path="/editor/:productId/:variationId/:zoneId" element={<EditorPage />} />
        </Routes>
        <CartSidebar />
      </HashRouter>
    </CartProvider>
  );
};

export default App;