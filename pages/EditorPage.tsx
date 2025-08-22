import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productCatalog, IMAGE_FEE_PRODUCT_VARIANT_ID, TEXT_ENGRAVING_TIERS } from '../constants';
import { useCart } from '../context/CartContext';
import type { PriceDetails, EngravingZone, CartItem } from '../types';
import { getStyleForMaterial } from '../styles/materialStyles';

// Import new and existing components
import EditorToolbar from '../components/EditorToolbar';
import PricingBreakdown from '../components/PricingBreakdown';
import LayersPanel from '../components/LayersPanel';
import Notification from '../components/Notification';
import ZoneSelector from '../components/ZoneSelector';
import { CartIcon, CloseIcon, InfoIcon, Spinner } from '../components/icons';
import CartNotification from '../components/CartNotification';
import AIQuoteGeneratorModal from '../components/AIQuoteGeneratorModal';

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
    
    const [priceDetails, setPriceDetails] = useState<PriceDetails>({ base: 0, text: 0, images: 0, total: 0, characterCount: 0 });
    const [layers, setLayers] = useState<any[]>([]);
    const [activeObject, setActiveObject] = useState<any>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(true);
    const [isPricingImage, setIsPricingImage] = useState(false);
    
    const [zoneStates, setZoneStates] = useState<{ [key: string]: CanvasState }>({});
    const [activeZoneId, setActiveZoneId] = useState<string | null>(zoneId || null);

    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const isRestoringState = useRef(false);

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
    
    const isNotConfigured = useMemo(() => {
      if (!productData) return false;
      // Check the main product, all text tiers, and the image fee product for placeholder IDs.
      return isPlaceholderVariantId(productData.variation.variantId) ||
             TEXT_ENGRAVING_TIERS.some(tier => isPlaceholderVariantId(tier.variantId)) ||
             isPlaceholderVariantId(IMAGE_FEE_PRODUCT_VARIANT_ID);
    }, [productData]);

    const isCtaDisabled = isNotConfigured || !!initializationError || isPricingImage;

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
            
            // Set the initial price as soon as product data is available
            const base = productData.product.basePrice;
            setPriceDetails({ base, text: 0, images: 0, total: base, characterCount: 0 });
        }
    }, [productData]);
    
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

        const base = productData.product.basePrice;
        const total = base + textFee + totalImageFee;
        setPriceDetails({ base, text: textFee, images: totalImageFee, total, characterCount: totalCharacterCount });
        
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
          window.fabric.Image.fromURL(productData.variation.mockupImage, (img: any) => {
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
                  console.error("Failed to load background image:", productData.variation.mockupImage);
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const response = await fetch('/.netlify/functions/image-pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageData }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ error: 'Could not parse error response.' }));
                throw new Error(errorBody.error || `Failed to get pricing from server. Status: ${response.status}`);
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
             if (error.name === 'AbortError') {
                console.error("Image pricing request timed out.");
                showNotification("Error: The request took too long. The file might be too complex.");
            } else {
                console.error("Image pricing error:", error);
                showNotification(`Error: ${error.message || "Could not calculate image price. Please try again."}`);
            }
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
    }
    
    const toggleTextStyle = (style: 'bold' | 'italic' | 'underline') => {
        if (!activeObject?.isType('textbox')) return;

        const isStyleActive = (prop: string, value: any) => activeObject.get(prop) === value;

        switch (style) {
            case 'bold':
                modifyActiveObject({ fontWeight: isStyleActive('fontWeight', 'bold') ? 'normal' : 'bold' });
                break;
            case 'italic':
                modifyActiveObject({ fontStyle: isStyleActive('fontStyle', 'italic') ? 'normal' : 'italic' });
                break;
            case 'underline':
                modifyActiveObject({ underline: !isStyleActive('underline', true) });
                break;
        }
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

        // First, ensure the current zone's state is saved before calculation
        const updatedZoneStates = { ...zoneStates };
        if (activeZoneId && fabricRef.current) {
            const json = JSON.stringify(fabricRef.current.toJSON(['data']));
            updatedZoneStates[activeZoneId] = { ...updatedZoneStates[activeZoneId], json };
        }

        let totalCharacterCount = 0;
        let totalImageFee = 0;
        const allText: string[] = [];

        // Loop through all zones to check for customizations
        Object.values(updatedZoneStates).forEach(state => {
            if (state.json) {
                try {
                    const parsed = JSON.parse(state.json);
                    parsed.objects.forEach((obj: any) => {
                        if (obj.data?.userAdded) {
                            if (obj.type === 'textbox' && obj.text) {
                                totalCharacterCount += obj.text.length;
                                allText.push(obj.text);
                            } else if ((obj.type === 'image' || obj.type === 'group') && obj.data?.price) {
                                totalImageFee += obj.data.price;
                            }
                        }
                    });
                } catch (e) {
                    console.error('Error processing zone JSON for fee calculation', e);
                }
            }
        });

        if (totalCharacterCount === 0 && totalImageFee === 0) {
            showNotification("Please add a design to at least one zone before adding to cart.");
            return;
        }
        
        const maxTier = TEXT_ENGRAVING_TIERS[TEXT_ENGRAVING_TIERS.length - 1];
        if (totalCharacterCount > maxTier.max) {
             showNotification(`Error: Character count of ${totalCharacterCount} exceeds the maximum of ${maxTier.max}.`);
             return;
        }

        const linesToAdd: CartItem[] = [];
        const uniqueBundleId = `luxcribe-${Date.now()}`;

        // 1. Add the base product
        linesToAdd.push({
            merchandiseId: productData.variation.variantId,
            quantity: 1,
            attributes: [
                { key: "_customizationImage", value: productData.variation.mockupImage },
                { key: "Total Price", value: `$${priceDetails.total.toFixed(2)}`},
                { key: "_Design: Main", value: JSON.stringify(updatedZoneStates[productData.initialZone.id]?.json || '{}') }, // Save at least one zone's design
                { key: "_customizationBundleId", value: uniqueBundleId },
                { key: "_isCustomizedParent", value: "true" }
            ]
        });

        // 2. Add the correct text fee variant based on character count
        if (totalCharacterCount > 0) {
            const tier = TEXT_ENGRAVING_TIERS.find(t => totalCharacterCount >= t.min && totalCharacterCount <= t.max);
            if(tier) {
                linesToAdd.push({
                    merchandiseId: tier.variantId,
                    quantity: 1,
                    attributes: [
                        { key: "Engraving Type", value: "Text Customization" },
                        { key: "Character Count", value: totalCharacterCount.toString() },
                        { key: "Engraved Text", value: allText.join(' | ').substring(0, 1024) },
                        { key: "_customizationBundleId", value: uniqueBundleId }
                    ]
                });
            }
        }
        
        // 3. Add the image fee product if applicable
        if (totalImageFee > 0) {
            linesToAdd.push({
                merchandiseId: IMAGE_FEE_PRODUCT_VARIANT_ID,
                quantity: 1,
                attributes: [
                    { key: "Engraving Type", value: "Image/Logo Customization" },
                    { key: "Calculated Fee", value: `$${totalImageFee.toFixed(2)}`},
                    { key: "_customizationBundleId", value: uniqueBundleId }
                ]
            });
        }

        try {
            await addToCart(linesToAdd);
            console.log('Successfully added customized item and fees to cart:', linesToAdd);
        } catch (error: any) {
            console.error("Failed to add to cart:", error);
            const friendlyMessage = (error.message || '').replace('Shopify Error: ', '');
            showNotification(`Error: ${friendlyMessage || "Could not add item to cart."}`);
        }
    };


    if (!productData || !activeZoneId || !zoneStates[activeZoneId]) return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Loading product...</div>;
    
    const currentHistory = zoneStates[activeZoneId];

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-900 text-white overflow-hidden">
            <CartNotification />
            <AIQuoteGeneratorModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                onSelectQuote={addTextWithQuote}
            />
            {/* Main Editor Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-shrink-0 relative z-10">
                  <EditorToolbar 
                    activeObject={activeObject}
                    onAddText={() => addText()}
                    onFileUpload={handleFileUpload}
                    onAddFromLibrary={addFromLibrary}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={currentHistory.historyIndex > 0}
                    canRedo={currentHistory.historyIndex < currentHistory.history.length - 1}
                    onModification={modifyActiveObject}
                    onToggleTextStyle={toggleTextStyle}
                    onTextCurveChange={handleTextCurveChange}
                    onDeleteObject={deleteLayer}
                    materialStyle={materialStyle}
                    onOpenQuoteGenerator={() => setIsQuoteModalOpen(true)}
                  />
                </div>
                <main ref={editorContainerRef} className="flex-1 relative bg-gray-900 p-4 flex items-center justify-center overflow-hidden">
                    <canvas ref={canvasRef} />
                    <Notification message={notification} />
                    {isDisclaimerVisible && (
                        <div className="absolute bottom-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-4xl bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg flex items-start gap-4 z-20">
                            <InfoIcon className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300 flex-grow">
                                <strong>Important:</strong> The preview is a visual guide. Final engraving results may vary slightly due to material, tool limitations, and design complexity. We will do our best to match your design.
                            </p>
                            <button 
                                onClick={() => setIsDisclaimerVisible(false)} 
                                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                aria-label="Dismiss disclaimer"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </main>
            </div>


            {/* Sidebar */}
            <aside className="w-full lg:w-96 bg-gray-800 p-6 flex-shrink-0 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-6">
                    <h2 className="text-2xl font-playfair">Design Details</h2>
                     <button
                        onClick={toggleCart}
                        className="relative text-gray-300 hover:text-indigo-400 transition-colors"
                        aria-label="Open shopping cart"
                    >
                        <CartIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {cartCount}
                            </span>
                        )}
                    </button>
                  </div>
                  
                  {productData.variation.engravingZones.length > 1 && (
                      <ZoneSelector 
                          zones={productData.variation.engravingZones}
                          activeZoneId={activeZoneId}
                          onSelectZone={handleSelectZone}
                      />
                  )}
                  
                  {isPricingImage && (
                    <div className="mb-4 p-3 bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-300">
                        <Spinner className="w-5 h-5 mr-3"/>
                        <span>Calculating image price...</span>
                    </div>
                  )}

                  <LayersPanel layers={layers} onSelectLayer={selectLayer} onDeleteLayer={deleteLayer} activeObject={activeObject} />

                  <div className="mt-8">
                    <PricingBreakdown priceDetails={priceDetails} />
                  </div>

                  {initializationError && (
                    <div className="mt-6 p-3 border border-red-500 rounded-lg bg-red-900/30 text-red-200 text-sm">
                        <p className="font-bold flex items-center">
                          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                          Cart Unavailable
                        </p>
                        <p className="mt-1">{initializationError}</p>
                        <p className="mt-1">Visit the <Link to="/about" className="underline font-semibold hover:text-white">About Page</Link> for details.</p>
                    </div>
                  )}

                  {isNotConfigured && (
                    <div className="mt-6 p-3 border border-yellow-500 rounded-lg bg-yellow-900/30 text-yellow-200 text-sm">
                        <p className="font-bold flex items-center">
                          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                          Configuration Needed
                        </p>
                        <p className="mt-1">This feature requires configuration. Please ensure the main product variant ID and the new fee product variant IDs in <code className="bg-gray-700 p-1 rounded text-xs">constants.ts</code> are updated with real values from your Shopify store.</p>
                    </div>
                  )}
                </div>
                 <div className="mt-6">
                    <button onClick={() => navigate(`/product/${productId}`)} className="w-full bg-gray-600 hover:bg-gray-700 p-3 rounded-lg mb-3 text-lg font-medium">Back to Product</button>
                    <button 
                        onClick={handleAddToCart} 
                        className="w-full p-3 rounded-lg text-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700"
                        disabled={isCtaDisabled}
                    >
                        {isPricingImage ? <Spinner className="w-6 h-6"/> : <CartIcon className="w-6 h-6"/>}
                        {isPricingImage ? 'Pricing Image...' : 'Add to Cart'}
                    </button>
                 </div>
            </aside>
        </div>
    );
};

export default EditorPage;