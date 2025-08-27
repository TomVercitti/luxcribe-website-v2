import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productCatalog, IMAGE_FEE_PRODUCT_VARIANT_ID, TEXT_ENGRAVING_TIERS } from '../constants';
import { useCart } from '../context/CartContext';
import type { PriceDetails, EngravingZone, CartItem, ShopifyProduct } from '../types';
import { getStyleForMaterial } from '../styles/materialStyles';
import { fetchProductsByHandles } from '../services/shopify';

// Import new and existing components
import EditorToolbar from '../components/EditorToolbar';
import PricingBreakdown from '../components/PricingBreakdown';
import LayersPanel from '../components/LayersPanel';
import Notification from '../components/Notification';
import ZoneSelector from '../components/ZoneSelector';
import { CartIcon, CloseIcon, InfoIcon, Spinner, CogIcon, SparklesIcon } from '../components/icons';
import CartNotification from '../components/CartNotification';
import AIQuoteGeneratorModal from '../components/AIQuoteGeneratorModal';
import TextControls from '../components/TextControls';
import TextEffectsControls from '../components/TextEffectsControls';
import HistoryControls from '../components/HistoryControls';
import ArrangeControls from '../components/ArrangeControls';
import DesignLibrary from '../components/DesignLibrary';
import AIGenerator from '../components/AIGenerator';
import { featureFlags } from '../config/featureFlags';

type CanvasState = {
    json: string | null;
    history: string[];
    historyIndex: number;
}

/**
 * Checks if a Shopify Variant GID is a placeholder used for demonstration.
 * @param variantId The Shopify Variant GID string.
 * @returns True if the ID is a placeholder, false otherwise.
 */
const isPlaceholderVariantId = (variantId: string): boolean => {
  // Example placeholder: "gid://shopify/ProductVariant/45000000000001"
  return /^gid:\/\/shopify\/ProductVariant\/450{10,}\d{1,2}$/.test(variantId);
};


const EditorPage: React.FC = () => {
    const { productId, variationId, zoneId } = useParams();
    const navigate = useNavigate();
    const { addToCart, initializationError, toggleCart, cartCount } = useCart();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<any>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [priceDetails, setPriceDetails] = useState<PriceDetails>({ base: 0, text: 0, images: 0, total: 0, characterCount: 0 });
    const [layers, setLayers] = useState<any[]>([]);
    const [activeObject, setActiveObject] = useState<any>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);
    const [isPricingImage, setIsPricingImage] = useState(false);
    
    const [zoneStates, setZoneStates] = useState<{ [key: string]: CanvasState }>({});
    const [activeZoneId, setActiveZoneId] = useState<string | null>(zoneId || null);

    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


    const isRestoringState = useRef(false);

    // Log feature flag on component mount to verify it's wired up
    useEffect(() => {
        console.log('Feature Flag - LUXCRIBE_PRICING_ENGINE is set to:', featureFlags.LUXCRIBE_PRICING_ENGINE);
    }, []);

    const productData = useMemo(() => {
        if (!productId || !variationId || !zoneId) return null;
        const product = productCatalog[productId];
        if (!product) return null;
        const variation = product.variations.find(v => v.id === variationId);
        if (!variation) return null;
        const initialZone = variation.engravingZones.find(z => z.id === zoneId);
        if(!initialZone) return null;
        return { product, variation, initialZone };
    }, [productId, variationId, zoneId]);
    
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
    
    const isNotConfigured = useMemo(() => {
      if (!productData) return false;
      // Check the main product, all text tiers, and the image fee product for placeholder IDs.
      return isPlaceholderVariantId(productData.variation.variantId) ||
             TEXT_ENGRAVING_TIERS.some(tier => isPlaceholderVariantId(tier.variantId)) ||
             isPlaceholderVariantId(IMAGE_FEE_PRODUCT_VARIANT_ID);
    }, [productData]);

    const isCtaDisabled = isNotConfigured || !!initializationError || isPricingImage || isLoadingPrice;

    const materialStyle = useMemo(() => 
        getStyleForMaterial(window.fabric, productData?.variation.material || 'default'),
        [productData]
    );

    const activeZone = useMemo(() => 
        productData?.variation.engravingZones.find(z => z.id === activeZoneId),
        [productData, activeZoneId]
    );

    // Effect to initialize zone states and initial price when product loads
    useEffect(() => {
        if (productData) {
            const initialStates: { [key: string]: CanvasState } = {};
            productData.variation.engravingZones.forEach(zone => {
                initialStates[zone.id] = { json: null, history: [''], historyIndex: 0 };
            });
            setZoneStates(initialStates);
            setActiveZoneId(productData.initialZone.id);
        }
    }, [productData]);

    // Effect to set the price once both local data and Shopify data are available
    useEffect(() => {
        if (productData && !isLoadingPrice) {
            let basePrice = productData.product.basePrice; // Fallback
            const liveVariant = shopifyProduct?.variants.edges.find(e => e.node.id === productData.variation.variantId);
            if (liveVariant) {
                basePrice = parseFloat(liveVariant.node.price.amount);
            }
            setPriceDetails(prev => ({ ...prev, base: basePrice, total: basePrice + prev.text + prev.images }));
        }
    }, [productData, shopifyProduct, isLoadingPrice]);
    
    const updateHistory = useCallback((canvas: any) => {
        if (isRestoringState.current || !activeZoneId) return;

        setZoneStates(prev => {
            const currentZoneState = prev[activeZoneId] || { json: null, history: [], historyIndex: -1 };
            const newHistory = currentZoneState.history.slice(0, currentZoneState.historyIndex + 1);
            const newCanvasState = JSON.stringify(canvas.toJSON(['data']));
            
            if (newHistory[newHistory.length - 1] === newCanvasState) {
                return prev;
            }

            newHistory.push(newCanvasState);

            return {
                ...prev,
                [activeZoneId]: {
                    ...currentZoneState,
                    history: newHistory,
                    historyIndex: newHistory.length - 1,
                }
            };
        });
    }, [activeZoneId]);

    const updateLayersAndPrice = useCallback(() => {
        if (!fabricRef.current || !productData) return;

        const currentCanvas = fabricRef.current;

        // This is the key part to update the toolbar's view of the active object
        const currentActive = currentCanvas.getActiveObject();
        if (currentActive && currentActive.data?.userAdded) {
            setActiveObject(currentActive);
        } else {
            setActiveObject(null);
        }

        const userObjects = currentCanvas.getObjects().filter((obj: any) => obj.data?.userAdded).reverse();
        setLayers(userObjects);

        const updatedZoneStates = { ...zoneStates };
        if (activeZoneId && fabricRef.current) {
            const json = JSON.stringify(fabricRef.current.toJSON(['data']));
            updatedZoneStates[activeZoneId] = { ...updatedZoneStates[activeZoneId], json };
        }
        
        // Calculate price across ALL zones based on character count and image presence
        let totalCharacterCount = 0;
        let totalImageFee = 0;

        Object.values(updatedZoneStates).forEach(state => {
            if (state.json) {
                try {
                    const canvasData = JSON.parse(state.json);
                    if (canvasData && canvasData.objects) {
                        for (const obj of canvasData.objects) {
                            if (obj.data?.userAdded) {
                                if (obj.type === 'textbox' && obj.text?.length > 0) {
                                    totalCharacterCount += obj.text.length;
                                } else if ((obj.type === 'image' || obj.type === 'group') && obj.data?.price) {
                                    totalImageFee += obj.data.price;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error parsing zone state for pricing:", e);
                }
            }
        });
        
        let textFee = 0;
        if (totalCharacterCount > 0) {
            const tier = TEXT_ENGRAVING_TIERS.find(t => totalCharacterCount >= t.min && totalCharacterCount <= t.max);
            if (tier) {
                textFee = tier.price;
            } else {
                // If over max, show price for max tier but will be blocked at checkout
                const maxTier = TEXT_ENGRAVING_TIERS[TEXT_ENGRAVING_TIERS.length - 1];
                 if (totalCharacterCount > maxTier.max) {
                    textFee = maxTier.price;
                }
            }
        }

        setPriceDetails(prev => ({
            ...prev,
            text: textFee,
            images: totalImageFee,
            total: prev.base + textFee + totalImageFee,
            characterCount: totalCharacterCount
        }));
        
    }, [productData, zoneStates, activeZoneId]);

    const loadZone = useCallback((zone: EngravingZone) => {
        if (!fabricRef.current || !zoneStates[zone.id]) return;
        isRestoringState.current = true;
        const canvas = fabricRef.current;
        const zoneState = zoneStates[zone.id];
        
        canvas.loadFromJSON(zoneState?.json || null, () => {
            const { x, y, width, height } = zone.bounds;
            const clipRect = new window.fabric.Rect({
                left: x, top: y, width, height,
                selectable: false, evented: false,
            });
            canvas.clipPath = clipRect;

            const guideRect = canvas.getObjects().find((o:any) => o.data?.isGuide);
            if(guideRect) canvas.remove(guideRect);
            
            const newGuideRect = new window.fabric.Rect({
                 left: x, top: y, width, height,
                fill: 'rgba(255,255,255,0.1)',
                stroke: 'rgba(99, 102, 241, 0.8)', strokeWidth: 2, strokeDashArray: [5, 5],
                selectable: false, evented: false,
                data: { isGuide: true }
            });
            canvas.add(newGuideRect);
            canvas.sendToBack(newGuideRect);

            canvas.renderAll();
            isRestoringState.current = false;

            const currentActive = canvas.getActiveObject();
             if(currentActive && currentActive.data?.userAdded) {
                setActiveObject(currentActive);
            } else {
                setActiveObject(null);
            }
            updateLayersAndPrice();
        });
    }, [zoneStates, updateLayersAndPrice]);

    const handleSelectZone = (newZoneId: string) => {
        if (newZoneId === activeZoneId || !fabricRef.current) return;
        
        const canvas = fabricRef.current;
        const json = canvas.toJSON(['data']);

        setZoneStates(prev => ({
            ...prev,
            [activeZoneId!]: {
                ...prev[activeZoneId!],
                json: JSON.stringify(json),
            }
        }));

        setActiveZoneId(newZoneId);
    };
    
    // Main canvas setup effect
    useEffect(() => {
        if (!canvasRef.current || !productData || !editorContainerRef.current) return;

        const container = editorContainerRef.current;
        const canvas = new window.fabric.Canvas(canvasRef.current, {
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: '#111827'
        });
        fabricRef.current = canvas;
        
        // Customize fabric controls globally to ensure a consistent look and feel
        window.fabric.Object.prototype.transparentCorners = false;
        window.fabric.Object.prototype.cornerColor = '#6366f1';
        window.fabric.Object.prototype.cornerStyle = 'circle';
        window.fabric.Object.prototype.borderColor = '#6366f1';
        // Add a visible rotation control handle that extends from the top of objects
        window.fabric.Object.prototype.controls.mtr.offsetY = -30;
        window.fabric.Object.prototype.controls.mtr.cursorStyle = 'grab';

        const setBackgroundImage = () => {
          window.fabric.Image.fromURL(productData.variation.mockupImage || '/placeholder.png', (img: any) => {
              if (img) {
                  const canvasWidth = canvas.getWidth();
                  const canvasHeight = canvas.getHeight();
                  const imgWidth = img.width;
                  const imgHeight = img.height;

                  const scaleX = canvasWidth / imgWidth;
                  const scaleY = canvasHeight / imgHeight;
                  const scale = Math.min(scaleX, scaleY);

                  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                      scaleX: scale,
                      scaleY: scale,
                      left: (canvasWidth - imgWidth * scale) / 2,
                      top: (canvasHeight - imgHeight * scale) / 2
                  });
              } else {
                  console.error("Failed to load background image:", productData.variation.mockupImage || '/placeholder.png');
              }
          });
        };
        setBackgroundImage();
        
        const updateCallback = () => {
            const currentActive = canvas.getActiveObject();
            if(currentActive && currentActive.data?.userAdded) {
                setActiveObject(currentActive);
            } else {
                setActiveObject(null);
            }
            if(activeZoneId && !isRestoringState.current) {
                const json = canvas.toJSON(['data']);
                 setZoneStates(prev => ({ ...prev, [activeZoneId]: { ...prev[activeZoneId], json: JSON.stringify(json) } }));
            }
            updateLayersAndPrice();
        }

        const historyCallback = () => {
            updateHistory(canvas);
            updateCallback();
        }
        
        canvas.on({
            'object:added': historyCallback,
            'object:removed': historyCallback,
            'object:modified': (e: any) => {
                const target = e.target;
                // When a textbox is scaled, we update its font size and width properties
                // and reset its scale to 1. This provides a more intuitive experience
                // where the font size in the toolbar always reflects the visual size.
                if (target && target.isType('textbox') && (target.scaleX !== 1 || target.scaleY !== 1)) {
                    const newFontSize = (target.fontSize || 1) * (target.scaleY || 1);
                    const newWidth = (target.width || 1) * (target.scaleX || 1);
                    target.set({
                        fontSize: newFontSize,
                        width: newWidth,
                        scaleX: 1,
                        scaleY: 1
                    });
                }
                historyCallback();
            },
            'text:changed': historyCallback,
            'selection:created': updateCallback,
            'selection:updated': updateCallback,
            'selection:cleared': updateCallback,
        });
        
        const handleResize = () => {
            canvas.setWidth(container.clientWidth);
            canvas.setHeight(container.clientHeight);
            setBackgroundImage();
            canvas.renderAll();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [productData, updateLayersAndPrice, updateHistory]);
    
    // Effect to load zone data when active zone changes
    useEffect(() => {
        if(activeZone && fabricRef.current && zoneStates[activeZone.id]) {
            loadZone(activeZone);
            setTimeout(() => {
                 if (fabricRef.current && zoneStates[activeZone.id].history.length <= 1) {
                    updateHistory(fabricRef.current);
                }
            }, 100);
        }
    }, [activeZone, loadZone]);


    const restoreCanvasState = (stateIndex: number) => {
        if (!fabricRef.current || !activeZoneId) return;
        isRestoringState.current = true;
        const canvas = fabricRef.current;
        const zoneState = zoneStates[activeZoneId];
        const jsonState = zoneState.history[stateIndex];
        
        if (!activeZone) return;

        canvas.loadFromJSON(jsonState, () => {
            const { x, y, width, height } = activeZone.bounds;
            const clipRect = new window.fabric.Rect({
                left: x, top: y, width, height,
                selectable: false, evented: false,
            });
            canvas.clipPath = clipRect;
            canvas.renderAll();
            
            updateLayersAndPrice();
            const currentActive = canvas.getActiveObject();
             if(currentActive && currentActive.data?.userAdded) {
                setActiveObject(currentActive);
            } else {
                setActiveObject(null);
            }

            isRestoringState.current = false;
        });
    }

    const handleUndo = () => {
        if (!activeZoneId) return;
        const zoneState = zoneStates[activeZoneId];
        if (zoneState.historyIndex > 0) {
            const newIndex = zoneState.historyIndex - 1;
            setZoneStates(prev => ({ ...prev, [activeZoneId]: { ...prev[activeZoneId], historyIndex: newIndex }}));
            restoreCanvasState(newIndex);
        }
    }

    const handleRedo = () => {
        if (!activeZoneId) return;
        const zoneState = zoneStates[activeZoneId];
        if (zoneState.historyIndex < zoneState.history.length - 1) {
            const newIndex = zoneState.historyIndex + 1;
            setZoneStates(prev => ({ ...prev, [activeZoneId]: { ...prev[activeZoneId], historyIndex: newIndex }}));
            restoreCanvasState(newIndex);
        }
    }

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const addObjectToCanvas = (obj: any) => {
        if (!fabricRef.current || !activeZone) return;
        const canvas = fabricRef.current;
        const zone = activeZone.bounds;

        // Apply material-specific styles
        if (obj.isType('textbox') || obj.isType('group')) {
            obj.set({ fill: materialStyle.fill });
            if (obj.isType('group')) {
                obj.forEachObject((el: any) => el.set({ fill: materialStyle.fill }));
            }
        }
        
        obj.set({
            left: zone.x + zone.width / 2,
            top: zone.y + zone.height / 2,
            originX: 'center',
            originY: 'center',
            shadow: new window.fabric.Shadow(materialStyle.shadow),
            opacity: materialStyle.objectOpacity,
        });

        const existingData = obj.data || {};
        obj.set('data', { ...existingData, userAdded: true });

        const maxDim = Math.min(zone.width, zone.height) * 0.8;
        if (obj.width > maxDim || obj.height > maxDim) {
            obj.scaleToWidth(maxDim);
        }

        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
    };
    
    const priceAndAddImage = async (imageData: string, type: 'svg' | 'png') => {
        setIsPricingImage(true);
        showNotification("Calculating engraving price for image...");

        try {
            const response = await fetch('/.netlify/functions/image-pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get pricing from server.');
            }
            
            const { price } = await response.json();

            const createObject = (callback: (obj: any) => void) => {
                if (type === 'svg') {
                    window.fabric.loadSVGFromString(imageData, (objects: any[], options: any) => {
                        const obj = window.fabric.util.groupSVGElements(objects, options);
                        callback(obj);
                    });
                } else {
                    window.fabric.Image.fromURL(imageData, (img: any) => {
                        img.filters = [...materialStyle.imageFilters];
                        img.applyFilters();
                        callback(img);
                    });
                }
            };
            
            createObject((fabricObject: any) => {
                fabricObject.set('data', { userAdded: true, type: fabricObject.type, price: price });
                addObjectToCanvas(fabricObject);
                showNotification(`Image added! Engraving fee: $${price.toFixed(2)}`);
            });

        } catch (error: any) {
            console.error("Image processing error:", error);
            showNotification(`Error: ${error.message || "Could not process the image."}`);
        } finally {
            setIsPricingImage(false);
        }
    };


    const addText = (textValue: string = 'Your Text') => {
        const text = new window.fabric.Textbox(textValue, {
            fontFamily: 'Playfair Display',
            fontSize: 160,
            width: 450,
            data: { userAdded: true, type: 'textbox' }
        });
        addObjectToCanvas(text);
    };

    const addTextWithQuote = (quote: string) => {
        addText(quote);
        setIsQuoteModalOpen(false); // Close modal after adding
    };
    
    const modifyActiveObject = (props: { [key: string]: any }) => {
        if (!activeObject) return;
        activeObject.set(props);
        fabricRef.current.renderAll();
        updateHistory(fabricRef.current);
        updateLayersAndPrice();
    }
    
    const handleArrange = (direction: 'front' | 'back' | 'forward' | 'backward') => {
        if (!activeObject || !fabricRef.current) return;
        const canvas = fabricRef.current;
        switch (direction) {
            case 'front':
                canvas.bringToFront(activeObject);
                break;
            case 'back':
                canvas.sendToBack(activeObject);
                break;
            case 'forward':
                canvas.bringForward(activeObject);
                break;
            case 'backward':
                canvas.sendBackwards(activeObject);
                break;
        }
        canvas.renderAll();
        updateHistory(canvas);
    };

    const handleAiImageSelect = (imageData: string) => {
        priceAndAddImage(imageData, 'png');
    };

    const handleTextCurveChange = (curve: number) => {
        if (activeObject?.isType('textbox')) {
            const data = activeObject.data || {};
            activeObject.data = {...data, curve: curve};
            
            if (curve === 0) {
                activeObject.set('path', null);
            } else {
                const width = activeObject.width;
                // This formula creates a reasonable arc radius based on the slider value and text width
                const radius = (width * 5) / (curve / 10);
                // An SVG path definition for an arc
                const pathData = curve > 0 
                    ? `M 0 ${-radius} A ${radius} ${radius} 0 0 1 ${width} ${-radius}`
                    : `M 0 ${radius} A ${radius} ${radius} 0 0 0 ${width} ${radius}`;
                
                const path = new window.fabric.Path(pathData, {
                    visible: false,
                    selectable: false,
                    evented: false,
                });
                activeObject.set('path', path);
            }
            fabricRef.current.renderAll();
            updateHistory(fabricRef.current);
            updateLayersAndPrice();
        }
    }
    
    const MAX_FILE_SIZE_MB = 4; // Reduced to account for base64 overhead and Netlify's 6MB limit
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_PNG_DIMENSION = 2000;
    const MAX_SVG_ELEMENTS = 10000;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const fileInput = e.target; // Keep a reference to clear it later

        if (!file) return;

        // 1. File Type Validation
        const allowedTypes = ['image/png', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            showNotification(`Error: Invalid file type. Please upload a .png or .svg file.`);
            fileInput.value = ''; // Clear input on error
            return;
        }

        // 2. File Size Validation
        if (file.size > MAX_FILE_SIZE_BYTES) {
            showNotification(`Error: File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
            fileInput.value = ''; // Clear input on error
            return;
        }
        
        // Asynchronous validation logic
        try {
            if (file.type === 'image/png') {
                // 3. PNG Resolution Check (Warning)
                const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => resolve({ width: img.width, height: img.height });
                        img.onerror = reject;
                        img.src = event.target?.result as string;
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                if (dimensions.width > MAX_PNG_DIMENSION || dimensions.height > MAX_PNG_DIMENSION) {
                    showNotification(`Warning: Image is large (${dimensions.width}x${dimensions.height}px). High detail may not engrave well.`);
                }
            }

            if (file.type === 'image/svg+xml') {
                // 4. SVG Complexity Check (Warning)
                const svgContent = await file.text();
                // Count path, shape, and text elements as a proxy for complexity
                const elementMatches = svgContent.match(/<(path|rect|circle|ellipse|line|polyline|polygon|text)/g);
                const elementCount = elementMatches ? elementMatches.length : 0;

                if (elementCount > MAX_SVG_ELEMENTS) {
                    showNotification(`Warning: SVG is complex (${elementCount} elements). Intricate designs may not engrave cleanly.`);
                }
            }
        } catch (error) {
            console.error("Error during file validation:", error);
            showNotification("An error occurred while reading the file.");
            fileInput.value = ''; // Clear input on error
            return;
        }

        // If all checks pass (or are just warnings), proceed with pricing and adding to canvas
        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            priceAndAddImage(data, file.type === 'image/svg+xml' ? 'svg' : 'png');
        };

        if (file.type === 'image/svg+xml') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
        
        fileInput.value = ''; // Clear the input so the same file can be selected again
    };


    const addFromLibrary = (svgString: string) => {
        priceAndAddImage(svgString, 'svg');
    }

    const deleteLayer = (layer: any) => {
        fabricRef.current?.remove(layer);
        fabricRef.current?.discardActiveObject();
        fabricRef.current?.renderAll();
    }
    
    const selectLayer = (layer: any) => {
        fabricRef.current?.setActiveObject(layer);
        fabricRef.current?.renderAll();
    }

    const handleAddToCart = async () => {
        if (!productData || isCtaDisabled) return;

        setIsPricingImage(true); // Re-use this for "adding to cart" state
        showNotification("Preparing your design for the cart...");

        try {
            const { product, variation } = productData;
            const itemsToAdd: CartItem[] = [];
            const customizationBundleId = new Date().getTime().toString();
            let finalPreviewImage = '';
            const customizedZones: string[] = [];

            // 1. Process all zones and generate a composite preview
            const canvasForPreview = new window.fabric.StaticCanvas(null, {
                width: fabricRef.current.width,
                height: fabricRef.current.height,
            });

            // Set the product mockup as the background
            await new Promise<void>(resolve => {
                window.fabric.Image.fromURL(variation.mockupImage, (img: any) => {
                    const canvasWidth = canvasForPreview.getWidth();
                    const canvasHeight = canvasForPreview.getHeight();
                    const scale = Math.min(canvasWidth / (img.width || 1), canvasHeight / (img.height || 1));
                    canvasForPreview.setBackgroundImage(img, () => resolve(), {
                        scaleX: scale,
                        scaleY: scale,
                        left: (canvasWidth - (img.width || 0) * scale) / 2,
                        top: (canvasHeight - (img.height || 0) * scale) / 2,
                    });
                });
            });

            const allZoneObjects: any[] = [];
            for (const zone of variation.engravingZones) {
                const zoneState = zoneStates[zone.id];
                if (zoneState && zoneState.json) {
                    const canvasData = JSON.parse(zoneState.json);
                    const userObjects = canvasData.objects?.filter((obj: any) => obj.data?.userAdded);
                    if (userObjects?.length > 0) {
                        customizedZones.push(zone.name);
                        allZoneObjects.push(...userObjects);
                    }
                }
            }
            
            // Render all objects onto the preview canvas
            if (allZoneObjects.length > 0) {
                 await new Promise<void>(resolve => {
                    canvasForPreview.loadFromJSON({ objects: allZoneObjects }, () => {
                        canvasForPreview.renderAll();
                        resolve();
                    });
                });
            }

            finalPreviewImage = canvasForPreview.toDataURL({ format: 'png', quality: 0.8 });
            
            // 2. Main Product Item
            itemsToAdd.push({
                merchandiseId: variation.variantId,
                quantity: 1,
                attributes: [
                    { key: '_isCustomizedParent', value: 'true' },
                    { key: '_customizationBundleId', value: customizationBundleId },
                    { key: '_customizationImage', value: finalPreviewImage },
                    { key: '_customizedZones', value: customizedZones.join(', ') || 'None' },
                    { key: 'Product Name', value: `${product.name} (${variation.name})` },
                ],
            });

            // 3. Text Engraving Fee Item
            if (priceDetails.text > 0 && priceDetails.characterCount > 0) {
                const tier = TEXT_ENGRAVING_TIERS.find(t => priceDetails.characterCount >= t.min && priceDetails.characterCount <= t.max);
                if (tier) {
                    itemsToAdd.push({
                        merchandiseId: tier.variantId,
                        quantity: 1,
                        attributes: [
                            { key: '_isCustomizationFee', value: 'true' },
                            { key: '_customizationBundleId', value: customizationBundleId },
                            { key: 'Fee For', value: `${product.name} (${variation.name})` }
                        ],
                    });
                }
            }

            // 4. Image Engraving Fee Item
            if (priceDetails.images > 0) {
                 itemsToAdd.push({
                    merchandiseId: IMAGE_FEE_PRODUCT_VARIANT_ID,
                    quantity: 1,
                    attributes: [
                        { key: '_isCustomizationFee', value: 'true' },
                        { key: '_customizationBundleId', value: customizationBundleId },
                        { key: 'Fee For', value: `${product.name} (${variation.name})` },
                        { key: 'Engraving Fee', value: priceDetails.images.toFixed(2) }
                    ],
                });
            }

            // 5. Add to cart
            if (itemsToAdd.length > 0) {
                await addToCart(itemsToAdd);
            }

        } catch (error: any) {
            console.error("Failed to add customized item to cart:", error);
            showNotification(`Error: ${error.message || "Could not add to cart."}`);
        } finally {
            setIsPricingImage(false);
        }
    };
    
    if (!productData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                    <p className="mb-8">The product you are trying to customize does not exist.</p>
                    <Link to="/shop" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const { product, variation } = productData;
    const canUndo = activeZoneId ? zoneStates[activeZoneId]?.historyIndex > 0 : false;
    const canRedo = activeZoneId ? zoneStates[activeZoneId]?.historyIndex < (zoneStates[activeZoneId]?.history.length || 0) - 1 : false;

    // Sidebar Content
    const sidebarContent = (
        <>
            <div className="p-4 border-b border-gray-700">
                <ZoneSelector 
                    zones={variation.engravingZones}
                    activeZoneId={activeZoneId || ''}
                    onSelectZone={handleSelectZone}
                />
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".png,.svg" />

            <div className="p-4 overflow-y-auto flex-grow">
                {activeObject ? (
                    <>
                        {activeObject.isType('textbox') && (
                            <>
                                <TextControls 
                                    onAddText={addText}
                                    onFontChange={(font) => modifyActiveObject({ fontFamily: font })}
                                    onTextAlign={(align) => modifyActiveObject({ textAlign: align })}
                                    activeObject={activeObject}
                                />
                                <TextEffectsControls 
                                    onCurveChange={handleTextCurveChange}
                                    onRotateChange={(angle) => modifyActiveObject({ angle })}
                                    activeObject={activeObject}
                                />
                            </>
                        )}
                        <ArrangeControls onArrange={handleArrange} activeObject={activeObject} />
                    </>
                ) : (
                    <>
                        {/* Content Creation Tools */}
                        <TextControls onAddText={addText} onFontChange={()=>{}} onTextAlign={()=>{}} activeObject={null} />
                        <div className="mb-4 p-3 bg-gray-900 rounded-lg space-y-2">
                             <h3 className="font-semibold text-indigo-300">Add Image or Design</h3>
                             <button onClick={() => setIsGuideModalOpen(true)} className="w-full bg-gray-600 hover:bg-gray-700 p-2 rounded text-sm font-semibold">
                                Upload from Computer
                            </button>
                             <button onClick={() => setIsQuoteModalOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm font-semibold flex items-center justify-center gap-2">
                                <SparklesIcon className="w-4 h-4"/>
                                AI Ideas for Text
                            </button>
                        </div>
                        <DesignLibrary onSelect={addFromLibrary} />
                        <AIGenerator onImageSelect={handleAiImageSelect} />
                    </>
                )}
                 
                <HistoryControls onUndo={handleUndo} onRedo={handleRedo} canUndo={canUndo} canRedo={canRedo}/>
                <LayersPanel layers={layers} onSelectLayer={selectLayer} onDeleteLayer={deleteLayer} activeObject={activeObject} />
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                {isLoadingPrice ? (
                    <div className="flex justify-center items-center h-24">
                        <Spinner />
                    </div>
                ) : (
                     <PricingBreakdown priceDetails={priceDetails} />
                )}
               
                <button 
                    onClick={handleAddToCart} 
                    disabled={isCtaDisabled}
                    className="w-full mt-4 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isPricingImage ? <Spinner className="w-6 h-6 mr-2" /> : <CartIcon className="w-6 h-6 mr-2"/>}
                    {isPricingImage ? 'Processing...' : 'Add to Cart'}
                </button>
                 {isNotConfigured && (
                    <p className="text-xs text-yellow-400 mt-2 text-center">Store not configured. Add to Cart is disabled.</p>
                )}
                 {initializationError && (
                    <p className="text-xs text-red-400 mt-2 text-center">Cart connection error. Add to Cart is disabled.</p>
                )}
            </div>
        </>
    );

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden text-white">
            <header className="flex-shrink-0 bg-gray-800 border-b border-gray-700 shadow-md z-30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <Link to={`/product/${productId}`} className="text-gray-400 hover:text-white flex items-center">
                                <CloseIcon className="w-5 h-5 mr-2" />
                                <span className="hidden md:inline">Back to Product</span>
                            </Link>
                            <div className="hidden md:block mx-4 h-8 w-px bg-gray-600" />
                            <div>
                                <h1 className="text-xl font-semibold">{product.name}</h1>
                                <p className="text-sm text-gray-400">{variation.name} - <span className="font-semibold">{activeZone?.name}</span></p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isDisclaimerVisible && (
                                <div className="hidden lg:flex items-center p-2 rounded-md bg-yellow-900/50 text-yellow-300 text-xs">
                                    <InfoIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>This is a visual guide. Final engraving may vary slightly.</span>
                                    <button onClick={() => setIsDisclaimerVisible(false)} className="ml-2 text-yellow-200 hover:text-white">&times;</button>
                                </div>
                            )}
                            <button onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-2 rounded-md hover:bg-gray-700">
                                <CogIcon className="w-6 h-6" />
                            </button>
                             <button onClick={toggleCart} className="relative p-2 rounded-md hover:bg-gray-700">
                                <CartIcon className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex overflow-hidden">
                {/* Desktop Sidebar */}
                <aside className="hidden md:flex flex-col w-96 bg-gray-800 border-r border-gray-700 flex-shrink-0">
                   {sidebarContent}
                </aside>

                {/* Mobile Sidebar */}
                 <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileSidebarOpen(false)}></div>
                    <aside className="relative flex flex-col w-96 max-w-[90vw] h-full bg-gray-800 border-r border-gray-700 flex-shrink-0">
                         <button onClick={() => setIsMobileSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
                            <CloseIcon />
                        </button>
                       {sidebarContent}
                    </aside>
                </div>


                <div className="flex-grow flex flex-col">
                    <div ref={editorContainerRef} className="flex-grow relative bg-gray-900">
                        <canvas ref={canvasRef} />
                        <Notification message={notification} />
                    </div>
                </div>
            </main>

            <CartNotification />
            <AIQuoteGeneratorModal 
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                onSelectQuote={addTextWithQuote}
            />

        </div>
    );
};

export default EditorPage;
