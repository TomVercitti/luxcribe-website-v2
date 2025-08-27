import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productCatalog } from '../constants';
import { useCart } from '../context/CartContext';
import { Spinner } from '../components/icons';
import { fetchProductsByHandles } from '../services/shopify';
import type { ShopifyProduct } from '../types';

/**
 * Checks if a Shopify Variant GID is a placeholder used for demonstration.
 * @param variantId The Shopify Variant GID string.
 * @returns True if the ID is a placeholder, false otherwise.
 */
const isPlaceholderVariantId = (variantId: string): boolean => {
  // Example placeholder: "gid://shopify/ProductVariant/45000000000001"
  return /^gid:\/\/shopify\/ProductVariant\/450{10,}\d{1,2}$/.test(variantId);
};


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = useMemo(() => productId ? productCatalog[productId] : undefined, [productId]);
  
  const { addToCart, initializationError } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    product?.variations[0].id || null
  );

  useEffect(() => {
    if (productId) {
      const fetchPrice = async () => {
        setIsLoadingPrice(true);
        try {
          const results = await fetchProductsByHandles([productId]);
          if (results.length > 0) {
            setShopifyProduct(results[0]);
          }
        } catch (error) {
          console.error("Failed to fetch Shopify product:", error);
        } finally {
          setIsLoadingPrice(false);
        }
      };
      fetchPrice();
    }
  }, [productId]);

  const selectedVariation = useMemo(() => 
    product?.variations.find(v => v.id === selectedVariationId),
    [product, selectedVariationId]
  );
  
  const priceMap = useMemo(() => {
    if (!shopifyProduct) return new Map<string, string>();
    return shopifyProduct.variants.edges.reduce((map, edge) => {
        map.set(edge.node.id, parseFloat(edge.node.price.amount).toFixed(2));
        return map;
    }, new Map<string, string>());
  }, [shopifyProduct]);

  const handleAddToCart = async () => {
    if (!selectedVariation || isNotConfigured || initializationError) return;

    setIsAddingToCart(true);
    try {
        await addToCart([{
            merchandiseId: selectedVariation.variantId,
            quantity: 1,
            attributes: [], // No customization
        }]);
    } catch (error) {
        console.error("Failed to add to cart:", error);
        // In a real app, you might show a notification to the user here.
    } finally {
        setIsAddingToCart(false);
    }
  };

  if (!product || !selectedVariation) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-playfair">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
          &larr; Back to Shop
        </Link>
      </div>
    );
  }

  const isNotConfigured = isPlaceholderVariantId(selectedVariation.variantId);
  const hasMultipleVariations = product.variations.length > 1;
  const isCtaDisabled = isNotConfigured || !!initializationError || isLoadingPrice;
  const currentPrice = priceMap.get(selectedVariation.variantId) || product.basePrice.toFixed(2);
  const isReadyMade = product.type === 'ready-made';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div className="md:sticky md:top-24">
          <div className="relative bg-gray-800 rounded-lg p-4">
            <img 
              src={selectedVariation.mockupImage || '/placeholder.png'} 
              alt={`${product.name} - ${selectedVariation.name}`}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-playfair mb-2">{product.name}</h1>
          <div className="text-2xl font-semibold text-indigo-400 mb-4 h-9">
            {isLoadingPrice ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
            ) : (
                `$${currentPrice}`
            )}
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>

          {/* Variations */}
          {hasMultipleVariations && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">
                Style: <span className="text-gray-300 font-normal">{selectedVariation.name}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variations.map(variation => (
                  <button 
                    key={variation.id} 
                    onClick={() => setSelectedVariationId(variation.id)}
                    className={`rounded-full p-1 transition-all ${selectedVariationId === variation.id ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500' : ''}`}
                    aria-label={`Select ${variation.name}`}
                  >
                    {variation.colorHex ? (
                      <div style={{ backgroundColor: variation.colorHex || '#808080' }} className="w-8 h-8 rounded-full border border-gray-600"></div>
                    ) : (
                      <span className={`block px-4 py-1.5 rounded-full text-sm ${selectedVariationId === variation.id ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>{variation.name}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Cart Initialization Error */}
          {initializationError && (
              <div className="my-6 p-4 border-2 border-dashed border-red-500 rounded-lg bg-red-900/30 text-red-200">
                <h3 className="font-bold text-lg flex items-center">
                  <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  Cart Unavailable
                </h3>
                <p className="mt-2">{initializationError}</p>
                <p className="mt-2">This is usually caused by incorrect Shopify credentials. Please visit the <Link to="/about" className="underline font-semibold hover:text-white">About Page</Link> for a connection status check and instructions.</p>
              </div>
            )}

          {/* Configuration Warning */}
          {isNotConfigured && (
              <div className="my-6 p-4 border-2 border-dashed border-yellow-500 rounded-lg bg-yellow-900/30 text-yellow-200">
                <h3 className="font-bold text-lg flex items-center">
                  <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                  Action Required: Configuration Needed
                </h3>
                <p className="mt-2">This product variant is not yet configured for sale. The "Customize" buttons are disabled.</p>
                <p className="mt-2">To fix this, you must replace the placeholder <code className="bg-gray-700 p-1 rounded text-xs">variantId</code> in your <code className="bg-gray-700 p-1 rounded text-xs">constants.ts</code> file with a real Shopify Variant GID from your store.</p>
                <p className="mt-2 text-sm">Current placeholder ID: <code className="bg-gray-700 p-1 rounded text-xs">{selectedVariation.variantId}</code></p>
              </div>
            )}

          {/* Actions CTA */}
          <div className="mt-6 p-6 border border-gray-700 rounded-lg bg-gray-800/50">
             <h3 className="text-xl font-semibold mb-4 text-white">
                {isReadyMade ? 'Purchase' : 'Purchase Options'}
             </h3>
             <div className="flex flex-col gap-4">
                {isReadyMade ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={isCtaDisabled || isAddingToCart}
                    className="w-full text-center px-6 py-3 font-semibold rounded-md transition-colors text-lg flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                   {isAddingToCart ? <Spinner className="w-6 h-6" /> : 'Add to Cart'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={isCtaDisabled || isAddingToCart}
                      className="w-full text-center px-6 py-3 font-semibold rounded-md transition-colors text-lg flex items-center justify-center bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                     {isAddingToCart ? (
                       <Spinner className="w-6 h-6" />
                     ) : (
                       'Add to Cart (No Customization)'
                     )}
                   </button>
                  
                   <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-600"></div>
                      <span className="flex-shrink mx-4 text-gray-400">OR</span>
                      <div className="flex-grow border-t border-gray-600"></div>
                  </div>
    
                   <div className="flex flex-col gap-3">
                     {selectedVariation.engravingZones.length > 0 && (
                       <Link
                         to={isCtaDisabled ? '#' : `/editor/${product.id}/${selectedVariation.id}/${selectedVariation.engravingZones[0].id}`}
                         className={`block w-full text-center px-6 py-3 font-semibold rounded-md transition-colors text-lg
                          ${isCtaDisabled 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed pointer-events-none' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                         aria-disabled={isCtaDisabled}
                         onClick={(e) => isCtaDisabled && e.preventDefault()}
                       >
                         Customize
                       </Link>
                     )}
                   </div>
                  </>
                )}
             </div>
             {!hasMultipleVariations && (
                <p className="text-sm text-gray-400 mt-4">Style: {selectedVariation.name}</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;