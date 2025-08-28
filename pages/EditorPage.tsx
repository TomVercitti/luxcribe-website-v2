import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productCatalog, DYNAMIC_ENGRAVING_FEE_VARIANT_ID } from '../constants';
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
import { featureFlags } from '../config/featureFlags';
// FIX: Import the 'UploadGuideModal' component to resolve the 'Cannot find name' error.
import UploadGuideModal from '../components/UploadGuideModal';

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
    
    // State for the new all-in-one calculator
    const [metafields, setMetafields] = useState<Record<string, any>>({});
    const [quantity, setQuantity] = useState(1);
    const [priceDetails, setPriceDetails] = useState<PriceDetails>({
        base: 0, material: 0, setup: 0, vectorize: 0, photo: 0,
        engravingCost: 0, extraAreaCost: 0, subtotal: 0,
        discount: 0, quantity: 1, total: 0
    });
    
    const [layers, setLayers] = useState<any[]>([]);
    const [activeObject, setActiveObject] = useState<any>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);
    const [isPricing, setIsPricing] = useState(false);
    
    const [zoneStates, setZoneStates] = useState<{ [key: string]: CanvasState }>({});
    const [activeZoneId, setActiveZoneId] = useState<string | null>(zoneId || null);

    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
    const [isLoadingProductData, setIsLoadingProductData] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const isRestoringState = useRef(false);
    const pricingTimeoutRef = useRef<number | null>(null);

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
    
    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    // Centralized function to set the background image, wrapped in useCallback for performance.
    const setBackgroundImage = useCallback(() => {
        const canvas = fabricRef.current;
        const variation = productData?.variation;
        if (!canvas || !variation) return;

        window.fabric.Image.fromURL(variation.mockupImage || '/placeholder.png', (img: any) => {
            if (img) {
                const canvasWidth = canvas.getWidth();
                const canvasHeight = canvas.getHeight();
                const scale = Math.min(canvasWidth / (img.width || 1), canvasHeight / (img.height || 1));

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    scaleX: scale,
                    scaleY: scale,
                    left: (canvasWidth - (img.width || 0) * scale) / 2,
                    top: (canvasHeight - (img.height || 0) * scale) / 2
                });
            } else {
                console.error("Failed to load background image:", variation.mockupImage || '/placeholder.png');
            }
        }, { crossOrigin: 'anonymous' });
    }, [productData]);

    useEffect(() => {
        if (productId) {
            const fetchProductData = async () => {
                setIsLoadingProductData(true);
                try {
                    const results = await fetchProductsByHandles([productId]);
                    if (results.length > 0) {
                        setShopifyProduct(results[0]);
                    } else {
                        throw new Error("Product not found via Shopify API.");
                    }
                } catch (error: any) {
                    console.error("Failed to fetch Shopify product data:", error);
                    showNotification(`Error: Could not load product data. ${error.message}`);
                } finally {
                    setIsLoadingProductData(false);
                }
            };
            fetchProductData();
        }
    }, [productId]);

    // This effect processes metafields once the shopifyProduct is loaded.
    // It replaces the need for a separate Netlify function call.
    useEffect(() => {
        if (!shopifyProduct) return;

        try {
            const mf: Record<string, any> = {};
            // Check if metafields exist. If not, it could be a permissions issue on the Storefront token.
            if (shopifyProduct.engravingMetafields && shopifyProduct.engravingMetafields.length > 0) {
                 shopifyProduct.engravingMetafields
                    .filter(metafield => metafield) // Filter out nulls
                    .forEach((metafield) => {
                        if (metafield.type && (metafield.type.includes("decimal") || metafield.type.includes("integer"))) {
                            mf[metafield.key] = parseFloat(metafield.value);
                        } else if (metafield.type === "json") {
                            try {
                               mf[metafield.key] = JSON.parse(metafield.value);
                            } catch(e) { console.error(`Failed to parse JSON for metafield ${metafield.key}:`, e) }
                        } else {
                            mf[metafield.key] = metafield.value;
                        }
                    });
            } else {
                console.warn("No engraving metafields found for this product. Pricing engine will use defaults. Check Storefront API token permissions for metafields.");
            }
            setMetafields(mf);
        } catch (err: any) {
            console.error("Error parsing metafields:", err);
            showNotification(`Error: ${err.message || "Could not parse pricing data."}`);
        }
    }, [shopifyProduct]);
    
    const isNotConfigured = useMemo(() => {
      if (!productData) return false;
      return isPlaceholderVariantId(productData.variation.variantId) ||
             isPlaceholderVariantId(DYNAMIC_ENGRAVING_FEE_VARIANT_ID);
    }, [productData]);

    const isCtaDisabled = isNotConfigured || !!initializationError || isPricing || isLoadingProductData;

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
    
    // Core pricing calculation logic, runs when metafields, quantity, or designs change.
    useEffect(() => {
        if (pricingTimeoutRef.current) {
            clearTimeout(pricingTimeoutRef.current);
        }

        pricingTimeoutRef.current = window.setTimeout(() => {
            if (!productData || !shopifyProduct) return;
            setIsPricing(true);

            // 1. Calculate total artwork area in mm² from all zones
            let totalArtworkArea = 0;
            for (const zone of productData.variation.engravingZones) {
                const zoneState = zoneStates[zone.id];
                if (zoneState && zoneState.json) {
                    const canvasData = JSON.parse(zoneState.json);
                    const userObjects = canvasData.objects?.filter((obj: any) => obj.data?.userAdded);
                    if (userObjects) {
                        for (const obj of userObjects) {
                            const width_px = (obj.width || 0) * (obj.scaleX || 1);
                            const height_px = (obj.height || 0) * (obj.scaleY || 1);
                            const area_px = width_px * height_px;
                            totalArtworkArea += area_px / (zone.px_per_mm * zone.px_per_mm);
                        }
                    }
                }
            }

            // 2. Perform price calculation based on user's logic
            const liveVariant = shopifyProduct.variants.edges.find(e => e.node.id === productData.variation.variantId);
            const liveBasePrice = liveVariant ? parseFloat(liveVariant.node.price.amount) : productData.product.basePrice;

            let base = liveBasePrice;
            let material = metafields.material_cost || 0;
            let setup = totalArtworkArea > 0 ? (metafields.setup_fee || 0) : 0;
            let vectorize = metafields.vectorize_fee || 0;
            let photo = metafields.photo_fee || 0;

            let engravingTime = (totalArtworkArea / (metafields.engraving_rate_mm2_per_min || 1)) + (metafields.base_time_overhead_min || 0);
            let engravingCost = engravingTime * (metafields.labour_rate_per_min || 0);

            let extraAreaCost = Math.max(0, totalArtworkArea - (metafields.included_area_mm2 || 0)) * (metafields.area_rate || 0);
            
            let subtotal = base + material + setup + vectorize + photo + engravingCost + extraAreaCost;
            if (totalArtworkArea > 0) {
                 subtotal = Math.max(subtotal, metafields.min_charge || 0);
            }

            let discount = 0;
            if (metafields.bulk_tiers && Array.isArray(metafields.bulk_tiers)) {
                metafields.bulk_tiers.forEach((tier: {min: number; discount: number}) => {
                    if (quantity >= tier.min) discount = Math.max(discount, tier.discount);
                });
            }
            
            let totalAfterDiscount = subtotal * quantity * (1 - discount);

            if (metafields.quickbuy_fixed_price) {
                totalAfterDiscount = metafields.quickbuy_fixed_price * quantity;
            }

            // 3. Set final price details
            setPriceDetails({
                base, material, setup, vectorize, photo, engravingCost, extraAreaCost,
                subtotal, discount, quantity, total: totalAfterDiscount
            });
            setIsPricing(false);
        }, 500); // 500ms debounce

        return () => {
            if (pricingTimeoutRef.current) {
                clearTimeout(pricingTimeoutRef.current);
            }
        };

    }, [metafields, quantity, zoneStates, productData, shopifyProduct]);


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

    const updateLayersAndState = useCallback(() => {
        if (!fabricRef.current || !productData) return;
        const currentCanvas = fabricRef.current;

        const currentActive = currentCanvas.getActiveObject();
        setActiveObject(currentActive && currentActive.data?.userAdded ? currentActive : null);

        const userObjects = currentCanvas.getObjects().filter((obj: any) => obj.data?.userAdded).reverse();
        setLayers(userObjects);

        if (activeZoneId) {
            const json = JSON.stringify(fabricRef.current.toJSON(['data']));
            setZoneStates(prev => {
                if(prev[activeZoneId]?.json === json) return prev; // Avoid unnecessary updates
                return { ...prev, [activeZoneId]: { ...prev[activeZoneId], json } };
            });
        }
    }, [productData, activeZoneId]);

    const loadZone = useCallback((zone: EngravingZone) => {
        if (!fabricRef.current || !zoneStates[zone.id]) return;
        isRestoringState.current = true;
        const canvas = fabricRef.current;
        const zoneState = zoneStates[zone.id];
        
        canvas.loadFromJSON(zoneState?.json || null, () => {
            // FIX: Re-apply the background image. `loadFromJSON` clears the entire canvas,
            // so the background needs to be reset after loading the objects for the new zone.
            setBackgroundImage();

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

            updateLayersAndState();
        });
    }, [zoneStates, updateLayersAndState, setBackgroundImage]);

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
        
        window.fabric.Object.prototype.transparentCorners = false;
        window.fabric.Object.prototype.cornerColor = '#6366f1';
        window.fabric.Object.prototype.cornerStyle = 'circle';
        window.fabric.Object.prototype.borderColor = '#6366f1';
        window.fabric.Object.prototype.controls.mtr.offsetY = -30;
        window.fabric.Object.prototype.controls.mtr.cursorStyle = 'grab';

        const historyCallback = () => {
            updateHistory(canvas);
            updateLayersAndState();
        }
        
        canvas.on({
            'object:added': historyCallback,
            'object:removed': historyCallback,
            'object:modified': (e: any) => {
                const target = e.target;
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
            'selection:created': updateLayersAndState,
            'selection:updated': updateLayersAndState,
            'selection:cleared': updateLayersAndState,
        });
        
        const handleResize = () => {
            canvas.setWidth(container.clientWidth);
            canvas.setHeight(container.clientHeight);
            setBackgroundImage();
            canvas.renderAll();
        };
        window.addEventListener('resize', handleResize);

        // Initial background image set on canvas creation.
        setBackgroundImage();

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
    }, [productData, updateLayersAndState, updateHistory, setBackgroundImage]);
    
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
            
            updateLayersAndState();
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

    const addObjectToCanvas = (obj: any) => {
        if (!fabricRef.current || !activeZone) return;
        const canvas = fabricRef.current;
        const zone = activeZone.bounds;

        if (obj.isType('textbox') || obj.isType('group')) {
            obj.set({ fill: materialStyle.fill });
            if (obj.isType('group')) {
                obj.forEachObject((el: any) => el.set({ fill: materialStyle.fill }));
            }
        } else if (obj.isType('image')) {
            obj.filters = [...materialStyle.imageFilters];
            obj.applyFilters();
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
        // FIX: Manually trigger a state update. Programmatic actions like `add` and
        // `setActiveObject` don't always trigger the selection events needed to
        // update the React UI state. This ensures the UI reflects the new active object.
        updateLayersAndState();
    };

    const addImageToCanvas = (imageData: string, type: 'svg' | 'png') => {
        const createObject = (callback: (obj: any) => void) => {
            if (type === 'svg') {
                window.fabric.loadSVGFromString(imageData, (objects: any[], options: any) => {
                    callback(window.fabric.util.groupSVGElements(objects, options));
                });
            } else {
                window.fabric.Image.fromURL(imageData, callback);
            }
        };
        createObject(addObjectToCanvas);
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
        setIsQuoteModalOpen(false);
    };
    
    const modifyActiveObject = (props: { [key: string]: any }) => {
        if (!activeObject) return;
        activeObject.set(props);
        fabricRef.current.renderAll();
        updateHistory(fabricRef.current);
        updateLayersAndState();
    }
    
    const handleToggleTextStyle = (style: 'bold' | 'italic' | 'underline') => {
        if (!activeObject?.isType('textbox')) return;

        let newProps: any = {};
        switch (style) {
            case 'bold':
                newProps.fontWeight = activeObject.fontWeight === 'bold' ? 'normal' : 'bold';
                break;
            case 'italic':
                newProps.fontStyle = activeObject.fontStyle === 'italic' ? 'normal' : 'italic';
                break;
            case 'underline':
                newProps.underline = !activeObject.underline;
                break;
        }
        modifyActiveObject(newProps);
    };

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

    const handleTextCurveChange = (curve: number) => {
        if (activeObject?.isType('textbox')) {
            const data = activeObject.data || {};
            activeObject.data = {...data, curve: curve};
            
            if (curve === 0) {
                activeObject.set('path', null);
            } else {
                const width = activeObject.width;
                const radius = (width * 5) / (curve / 10);
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
            updateLayersAndState();
        }
    }
    
    const MAX_FILE_SIZE_MB = 4;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const fileInput = e.target;

        if (!file) return;

        if (!['image/png', 'image/svg+xml'].includes(file.type)) {
            showNotification(`Error: Invalid file type. Please upload a .png or .svg file.`);
            fileInput.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            showNotification(`Error: File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            addImageToCanvas(data, file.type === 'image/svg+xml' ? 'svg' : 'png');
        };

        if (file.type === 'image/svg+xml') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
        
        fileInput.value = '';
    };

    const deleteLayer = (layer: any) => {
        fabricRef.current?.remove(layer);
        fabricRef.current?.discardActiveObject();
        fabricRef.current?.renderAll();
    }
    
    const selectLayer = (layer: any) => {
        fabricRef.current?.setActiveObject(layer);
        fabricRef.current?.renderAll();
        // FIX: Similar to addObjectToCanvas, manually trigger a state update when
        // a layer is selected programmatically to ensure the UI controls update.
        updateLayersAndState();
    }

    const handleAddToCart = async () => {
        if (!productData || isCtaDisabled) return;

        setIsPricing(true);
        showNotification("Preparing your design for the cart...");

        try {
            const { product, variation } = productData;
            const itemsToAdd: CartItem[] = [];
            const customizationBundleId = new Date().getTime().toString();
            let finalPreviewImage = '';
            const customizedZones: string[] = [];

            const canvasForPreview = new window.fabric.StaticCanvas(null, {
                width: fabricRef.current.width,
                height: fabricRef.current.height,
            });

            // Collect all user-added objects from all zones
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
            
            // FIX: Correctly generate the preview by loading objects first, then setting the background.
            // This ensures the background isn't cleared by `loadFromJSON`.
            const jsonToLoad = { objects: allZoneObjects };
            await new Promise<void>(resolve => {
                canvasForPreview.loadFromJSON(jsonToLoad, () => {
                    window.fabric.Image.fromURL(variation.mockupImage, (img: any) => {
                        if (!img) { resolve(); return; }
                        
                        const canvasWidth = canvasForPreview.getWidth();
                        const canvasHeight = canvasForPreview.getHeight();
                        const scale = Math.min(canvasWidth / (img.width || 1), canvasHeight / (img.height || 1));
                        
                        canvasForPreview.setBackgroundImage(img, () => {
                            canvasForPreview.renderAll();
                            resolve(); // Resolve after background is set and rendered
                        }, {
                            scaleX: scale, scaleY: scale,
                            left: (canvasWidth - (img.width || 0) * scale) / 2,
                            top: (canvasHeight - (img.height || 0) * scale) / 2,
                        });
                    }, { crossOrigin: 'anonymous' });
                });
            });

            finalPreviewImage = canvasForPreview.toDataURL({ format: 'png', quality: 0.8 });
            
            itemsToAdd.push({
                merchandiseId: variation.variantId,
                quantity: priceDetails.quantity,
                attributes: [
                    { key: '_isCustomizedParent', value: 'true' },
                    { key: '_customizationBundleId', value: customizationBundleId },
                    { key: '_customizationImage', value: finalPreviewImage },
                    { key: '_customizedZones', value: customizedZones.join(', ') || 'None' },
                    { key: 'Product Name', value: `${product.name} (${variation.name})` },
                ],
            });

            const totalCustomFee = priceDetails.total - (priceDetails.base * priceDetails.quantity);

            // Add the fee using a $1.00 product where quantity = the fee amount
            if (totalCustomFee > 0.01) {
                 itemsToAdd.push({
                    merchandiseId: DYNAMIC_ENGRAVING_FEE_VARIANT_ID,
                    quantity: Math.round(totalCustomFee),
                    attributes: [
                        { key: '_isCustomizationFee', value: 'true' },
                        { key: '_customizationBundleId', value: customizationBundleId },
                        { key: 'Fee For', value: `${product.name} (${variation.name})` }
                    ],
                });
            }

            if (itemsToAdd.length > 0) {
                await addToCart(itemsToAdd);
            }

        } catch (error: any) {
            console.error("Failed to add customized item to cart:", error);
            showNotification(`Error: ${error.message || "Could not add to cart."}`);
        } finally {
            setIsPricing(false);
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
                                    onFontSizeChange={(size) => modifyActiveObject({ fontSize: size })}
                                    onToggleTextStyle={handleToggleTextStyle}
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
                        <TextControls 
                            onAddText={addText} 
                            onFontChange={()=>{}} 
                            onTextAlign={()=>{}} 
                            onFontSizeChange={() => {}}
                            onToggleTextStyle={() => {}}
                            activeObject={null} 
                        />
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
                    </>
                )}
                 
                <HistoryControls onUndo={handleUndo} onRedo={handleRedo} canUndo={canUndo} canRedo={canRedo}/>
                <LayersPanel layers={layers} onSelectLayer={selectLayer} onDeleteLayer={deleteLayer} activeObject={activeObject} />
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                {isLoadingProductData ? (
                    <div className="flex justify-center items-center h-48">
                        <Spinner />
                    </div>
                ) : (
                     <PricingBreakdown 
                        priceDetails={priceDetails} 
                        onQuantityChange={setQuantity}
                     />
                )}
               
                <button 
                    onClick={handleAddToCart} 
                    disabled={isCtaDisabled}
                    className="w-full mt-4 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isPricing ? <Spinner className="w-6 h-6 mr-2" /> : <CartIcon className="w-6 h-6 mr-2"/>}
                    {isPricing ? 'Calculating...' : 'Add to Cart'}
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
             <UploadGuideModal 
                isOpen={isGuideModalOpen} 
                onClose={() => setIsGuideModalOpen(false)} 
                onProceed={() => {
                    setIsGuideModalOpen(false);
                    fileInputRef.current?.click();
                }}
            />

        </div>
    );
};

export default EditorPage;