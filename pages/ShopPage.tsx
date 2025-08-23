import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productCatalog } from '../constants';
import { fetchProductsByHandles } from '../services/shopify';
import type { Product, ShopifyProduct } from '../types';

const ShopPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [liveProducts, setLiveProducts] = useState<Record<string, ShopifyProduct>>({});
  const [isLoading, setIsLoading] = useState(true);

  const products = Object.values(productCatalog);

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const productHandles = products.map(p => p.id);
        const shopifyProducts = await fetchProductsByHandles(productHandles);
        const productMap = shopifyProducts.reduce((acc, sp) => {
          acc[sp.handle] = sp;
          return acc;
        }, {} as Record<string, ShopifyProduct>);
        setLiveProducts(productMap);
      } catch (error) {
        console.error("Failed to fetch Shopify product prices:", error);
        // Prices will fallback to constants.ts values
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products;
    }
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const getProductPrice = (product: Product): string => {
    const liveProduct = liveProducts[product.id];
    if (liveProduct?.variants.edges.length > 0) {
        // Use the price of the first variant defined in our catalog as the "base" price.
        const baseVariantId = product.variations[0]?.variantId;
        if (baseVariantId) {
            const correspondingShopifyVariant = liveProduct.variants.edges.find(e => e.node.id === baseVariantId);
            if (correspondingShopifyVariant) {
                const price = parseFloat(correspondingShopifyVariant.node.price.amount);
                return `From $${price.toFixed(2)}`;
            }
        }
        // As a fallback if the primary variant isn't found, use the minimum price.
        const minPrice = Math.min(...liveProduct.variants.edges.map(e => parseFloat(e.node.price.amount)));
        return `From $${minPrice.toFixed(2)}`;
    }
    // Fallback to the static price from constants.ts if no live price is available
    return `From $${product.basePrice.toFixed(2)}`;
  };


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
        {filteredProducts.map(product => {
          const liveProduct = liveProducts[product.id];
          const imageUrl = liveProduct?.featuredImage?.url || product.featuredImage || product.variations[0]?.mockupImage || '/placeholder.png';

          return (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={imageUrl} 
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
                <p className="text-lg font-bold text-indigo-400">
                  {isLoading ? (
                      <span className="h-6 bg-gray-700 rounded w-24 inline-block animate-pulse"></span>
                  ) : (
                      getProductPrice(product)
                  )}
                </p>
                 <span className="text-sm font-semibold text-white bg-indigo-600/50 group-hover:bg-indigo-600 transition-colors px-3 py-1 rounded-full">
                    Customize
                  </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPage;