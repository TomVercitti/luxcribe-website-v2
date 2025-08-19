import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productCatalog } from '../constants';
import type { Product } from '../types';

const ShopPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const products = Object.values(productCatalog);
  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Our Collection</h1>
        <p className="mt-4 text-lg text-gray-400">Discover the perfect canvas for your next creation.</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1">
            <div className="relative">
              <img 
                src={product.variations[0].mockupImage} 
                alt={product.name} 
                className="w-full h-72 object-cover"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
               <div className="absolute bottom-4 left-4">
                 <h3 className="text-xl font-semibold font-lato text-white">{product.name}</h3>
                 <p className="text-sm text-gray-300">{product.category}</p>
               </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="text-lg font-bold text-indigo-400">From ${product.basePrice.toFixed(2)}</p>
               <span className="text-sm font-semibold text-white bg-indigo-600/50 group-hover:bg-indigo-600 transition-colors px-3 py-1 rounded-full">
                  Customize
                </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
