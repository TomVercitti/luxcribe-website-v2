import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { productCatalog, PRODUCT_FILTERS, PRICE_FILTERS } from '../constants';
import { fetchProductsByHandles } from '../services/shopify';
import type { Product, ShopifyProduct } from '../types';
import { CheckIcon, ChevronDownIcon } from '../components/icons';

const ShopPage: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activePriceRange, setActivePriceRange] = useState<string>('all');
  const [liveProducts, setLiveProducts] = useState<Record<string, ShopifyProduct>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const dropdownsRef = useRef<HTMLDivElement>(null);

  const products = useMemo(() => Object.values(productCatalog), []);
  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const categoryOptions = categories.map(c => ({ label: c, value: c }));

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, [products]);

  useEffect(() => {
    // This effect will run on mount and when URL changes to set filters
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam && PRODUCT_FILTERS.type.includes(typeParam)) {
      setActiveFilters(prev => ({ ...prev, type: [typeParam] }));
    } else {
      // If no type param, ensure it's cleared from filters
      setActiveFilters(prev => {
          const { type, ...rest } = prev;
          return rest;
      });
    }
  }, [location.search]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownsRef.current && !dropdownsRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (group: string, value: string) => {
    setActiveFilters(prev => {
      const newGroupFilters = prev[group] ? [...prev[group]] : [];
      const index = newGroupFilters.indexOf(value);

      if (index > -1) {
        newGroupFilters.splice(index, 1);
      } else {
        newGroupFilters.push(value);
      }

      if (newGroupFilters.length === 0) {
        const { [group]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [group]: newGroupFilters };
    });
  };
  
  const getProductBasePrice = (product: Product): number => {
      const liveProduct = liveProducts[product.id];
      if (liveProduct?.variants.edges.length > 0) {
          const baseVariantId = product.variations[0]?.variantId;
          if (baseVariantId) {
              const correspondingShopifyVariant = liveProduct.variants.edges.find(e => e.node.id === baseVariantId);
              if (correspondingShopifyVariant) {
                  return parseFloat(correspondingShopifyVariant.node.price.amount);
              }
          }
          return Math.min(...liveProduct.variants.edges.map(e => parseFloat(e.node.price.amount)));
      }
      return product.basePrice;
  };

  const filteredProducts = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();

    let productsToFilter = products.filter(product => {
      // Category filter
      if (activeCategory !== 'All' && product.category !== activeCategory) return false;

      // Search term filter
      if (lowercasedSearchTerm && !(
          product.name.toLowerCase().includes(lowercasedSearchTerm) ||
          product.description.toLowerCase().includes(lowercasedSearchTerm) ||
          product.category.toLowerCase().includes(lowercasedSearchTerm))) {
        return false;
      }
      
      // Price range filter
      if (activePriceRange !== 'all') {
          const [min, max] = activePriceRange.split('-').map(Number);
          const price = getProductBasePrice(product);
          if (price < min || price > max) {
              return false;
          }
      }

      // Property & Tag-based filters (Type, Material, Occasion)
      const filterGroups = Object.keys(activeFilters);
      if (filterGroups.length > 0) {
          const passesAllFilters = filterGroups.every(group => {
              const selectedValues = activeFilters[group];
              if (!selectedValues || selectedValues.length === 0) return true;

              if (group === 'type') {
                  // Product type is a direct property
                  return selectedValues.includes(product.type || 'customizable');
              } else {
                  // Other filters are tag-based
                  return selectedValues.some(value => product.tags?.includes(value));
              }
          });
          if (!passesAllFilters) return false;
      }

      return true;
    });

    const getSortPrice = (product: Product): number => {
        const liveProduct = liveProducts[product.id];
        if (liveProduct?.variants.edges.length > 0) {
            return Math.min(...liveProduct.variants.edges.map(e => parseFloat(e.node.price.amount)));
        }
        return product.basePrice;
    };
    
    switch (sortOption) {
        case 'price-asc':
            productsToFilter.sort((a, b) => getSortPrice(a) - getSortPrice(b));
            break;
        case 'price-desc':
            productsToFilter.sort((a, b) => getSortPrice(b) - getSortPrice(a));
            break;
        case 'name-asc':
            productsToFilter.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            productsToFilter.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'newest':
            productsToFilter.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
            break;
        default:
            break;
    }

    return productsToFilter;
  }, [activeCategory, products, searchTerm, activeFilters, activePriceRange, sortOption, liveProducts]);

  const getProductPriceDisplay = (product: Product): string => {
    const liveProduct = liveProducts[product.id];
    if (liveProduct?.variants.edges.length > 0) {
        const basePrice = getProductBasePrice(product);
        return `From $${basePrice.toFixed(2)}`;
    }
    return `From $${product.basePrice.toFixed(2)}`;
  };
  
  // Reusable Dropdown Component for Filters
  const FilterDropdown = ({ name, options, selected, onSelect, isMultiSelect = false }: any) => {
    const currentLabel = isMultiSelect 
      ? `${name} ${selected.length > 0 ? `(${selected.length})` : ''}`
      : options.find((o: any) => o.value === selected)?.label || name;

    return (
        <div className="relative">
            <button
                onClick={() => setOpenDropdown(openDropdown === name ? null : name)}
                className="flex justify-between items-center bg-gray-900 border border-gray-600 hover:border-indigo-500 text-white py-2 px-4 rounded-md leading-tight focus:outline-none w-full sm:w-auto min-w-[150px]"
            >
                <span className="capitalize">{currentLabel}</span>
                <ChevronDownIcon className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${openDropdown === name ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === name && (
                <div className="absolute z-20 mt-1 w-full sm:w-56 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                        {options.map((option: any) => {
                            const isActive = isMultiSelect ? selected.includes(option.value) : selected === option.value;
                            return (
                                <li key={option.value}>
                                    <button
                                        onClick={() => onSelect(option.value)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 flex items-center justify-between"
                                    >
                                        <span className="capitalize">{option.label}</span>
                                        {isActive && <CheckIcon className="w-4 h-4 text-indigo-400" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Our Collection</h1>
        <p className="mt-4 text-lg text-gray-400">Discover the perfect canvas for your next creation.</p>
      </div>

      <div className="mb-8 w-full max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search for coasters, keychains, gifts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 bg-gray-800 text-white border border-gray-700 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
          aria-label="Search products"
        />
      </div>
      
      {/* Filter & Sort Bar */}
      <div className="mb-12 p-4 bg-gray-800/50 border border-gray-700 rounded-lg" ref={dropdownsRef}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left side: Filters */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full sm:w-auto">
                  <FilterDropdown name="Category" options={categoryOptions} selected={activeCategory} onSelect={(val: string) => { setActiveCategory(val); setOpenDropdown(null); }} />
                  <FilterDropdown name="Price" options={PRICE_FILTERS} selected={activePriceRange} onSelect={(val: string) => { setActivePriceRange(val); setOpenDropdown(null); }} />
                  
                  {Object.entries(PRODUCT_FILTERS).map(([group, tags]) => (
                      <FilterDropdown 
                        key={group} 
                        name={group} 
                        options={tags.map(t => ({label: t, value: t}))}
                        selected={activeFilters[group] || []} 
                        onSelect={(val: string) => handleFilterChange(group, val)} 
                        isMultiSelect={true}
                      />
                  ))}
              </div>

              {/* Right side: Sort */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label htmlFor="sort-by" className="text-gray-300 flex-shrink-0">Sort by:</label>
                  <div className="relative">
                      <select
                          id="sort-by"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="appearance-none w-full sm:w-auto bg-gray-900 border border-gray-600 text-white py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-gray-700 focus:border-indigo-500"
                          aria-label="Sort products by"
                      >
                          <option value="default">Relevance</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="name-asc">Alphabetically: A-Z</option>
                          <option value="name-desc">Alphabetically: Z-A</option>
                          <option value="newest">Newest</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <ChevronDownIcon className="w-4 h-4" />
                      </div>
                  </div>
              </div>
          </div>
      </div>


      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={product.variations[0].mockupImage || '/placeholder.png'} 
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
                      getProductPriceDisplay(product)
                  )}
                </p>
                 <span className={`text-sm font-semibold text-white group-hover:bg-indigo-600 transition-colors px-3 py-1 rounded-full ${product.type === 'ready-made' ? 'bg-green-600/50' : 'bg-indigo-600/50'}`}>
                    {product.type === 'ready-made' ? 'View Item' : 'Customize'}
                  </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-white">No Products Found</h2>
            <p className="mt-2 text-gray-400">
                Your search and filter combination did not match any products. Try adjusting your filters.
            </p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
