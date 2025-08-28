import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { fetchProductWithCustomMetafields } from '../services/shopify';
// FIX: Import the 'TrashIcon' component to resolve the 'Cannot find name' error.
import { Spinner, CloseIcon, TrashIcon } from '../components/icons';

// Using the px_per_mm from the main product definition for consistency
const PX_PER_MM = 3;
const PRODUCT_HANDLE = "slate-coasters";

interface CustomElement {
  id: number;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CoasterCustomizerPage() {
  const [metafields, setMetafields] = useState<Record<string, number>>({});
  const [price, setPrice] = useState(0);
  const [customElements, setCustomElements] = useState<CustomElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  // Fetch metafields
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const product = await fetchProductWithCustomMetafields(PRODUCT_HANDLE);
        if (!product || !product.customMetafields?.length) {
          throw new Error("Could not load product pricing data. Check the product handle ('slate-coasters') exists and has 'custom' namespace metafields published to the Storefront API.");
        }
        
        const fields: Record<string, number> = {};
        product.customMetafields
          .filter(metafield => metafield) // Filter out nulls
          .forEach((metafield) => {
            const value = parseFloat(metafield.value);
            if (!isNaN(value)) {
              fields[metafield.key] = value;
            }
          });

        if (!fields.base_price) {
            console.warn("base_price metafield not found. Using a default price.");
        }

        setMetafields(fields);
        setPrice(fields.base_price || 12.99); // Use fallback
        
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching product data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProductData();
  }, []);

  // Recalculate price
  useEffect(() => {
    if (Object.keys(metafields).length === 0) return;

    const totalAreaPx2 = customElements.reduce((sum, el) => sum + (el.width * el.height), 0);
    const totalAreaMm2 = totalAreaPx2 / (PX_PER_MM * PX_PER_MM);

    const chargeableAreaMm2 = Math.max(0, totalAreaMm2 - (metafields.included_area_mm2 || 0));

    const engravingTimeMin = chargeableAreaMm2 / (metafields.engraving_rate_mm2_per_min || 1);
    const labourCost = engravingTimeMin * (metafields.labour_rate_per_min || 0);
    
    let total = (metafields.base_price || 0) + labourCost;
    
    // Add setup fee only if there is custom work
    if (totalAreaMm2 > 0) {
      total += (metafields.setup_fee || 0);
      total += (metafields.material_cost || 0); // Assuming material cost is part of custom work
    }

    setPrice(Math.max(total, metafields.min_charge || 0));
  }, [customElements, metafields]);

  // Add elements
  const addText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setCustomElements([
      ...customElements,
      { id: Date.now(), type: "text", content: textInput, x: 50, y: 50, width: 200, height: 50 },
    ]);
    setTextInput('');
  };

  const updateElement = (id: number, updates: Partial<CustomElement>) => {
    setCustomElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: number) => {
    setCustomElements(prev => prev.filter(el => el.id !== id));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner className="w-12 h-12"/></div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-400 bg-red-900/50 rounded-lg mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Customize Your Slate Coaster</h1>
        <p className="mt-4 text-lg text-gray-400">Add your text and see the price update in real-time.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Customizer Canvas */}
        <div className="lg:col-span-2 relative w-full aspect-square max-w-2xl mx-auto border-2 border-dashed border-gray-700 rounded-lg overflow-hidden">
          <img
            src="https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Square_430x.webp?v=1755923080"
            alt="Slate Coaster"
            className="w-full h-full object-cover"
          />
          {customElements.map((el) => (
            <Rnd
              key={el.id}
              bounds="parent"
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              onDragStop={(e, d) => updateElement(el.id, { x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, position) => {
                updateElement(el.id, {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                });
              }}
              className="border border-indigo-500/50 border-dashed"
            >
              <div className="w-full h-full flex justify-center items-center text-center p-1 text-2xl font-playfair engraved-slate">
                {el.content}
              </div>
              <button 
                onClick={() => removeElement(el.id)} 
                className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-transform transform hover:scale-110"
                aria-label="Remove element"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </Rnd>
          ))}
        </div>

        {/* Controls and Pricing */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Controls</h2>
            <form onSubmit={addText} className="space-y-4">
                <div>
                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-300">Engraving Text</label>
                    <input 
                        id="text-input"
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter your text"
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Add Text
                </button>
            </form>
            
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Custom Elements:</h3>
                {customElements.length > 0 ? (
                    <ul className="space-y-2 text-gray-400">
                    {customElements.map((el) => (
                        <li key={el.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-md">
                            <span className="truncate">{el.type}: {el.content}</span>
                            <button onClick={() => removeElement(el.id)} className="text-gray-500 hover:text-red-400 ml-2">
                                <TrashIcon className="w-4 h-4"/>
                            </button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No elements added yet.</p>
                )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-playfair">Estimated Price:</span>
                    <span className="text-3xl font-bold text-indigo-400">
                        ${price.toFixed(2)}
                    </span>
                </div>
                 <button className="w-full mt-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600" disabled>
                    Add to Cart (Coming Soon)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}