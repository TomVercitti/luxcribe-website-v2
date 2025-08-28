export interface EngravingZone {
  id: string;
  name: string;
  // Defines the clickable/drawable area on the canvas
  bounds: { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
  };
  // The conversion factor from canvas pixels to real-world millimeters.
  // Example: If a 300px wide zone represents a 100mm area, px_per_mm = 3.
  px_per_mm: number;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g., "Matte Black", "Bamboo"
  colorHex?: string; // For rendering color swatches, e.g., "#000000"
  mockupImage: string; // The specific image for this variation
  engravingZones: EngravingZone[];
  variantId: string; // Shopify GraphQL GID, e.g., "gid://shopify/ProductVariant/12345"
  material?: string; // e.g., 'leather', 'metal', 'wood', 'glass'
}

export interface Product {
  id: string;
  name: string; // e.g., "Stainless Steel Tumbler"
  category: string; // e.g., "Drinkware & Barware"
  description: string;
  basePrice: number; // Used as a fallback if Shopify fetch fails
  variations: ProductVariation[];
  featuredImage?: string;
  tags?: string[];
  createdAt?: string;
  type?: 'customizable' | 'ready-made';
}

export interface PriceDetails {
  base: number;
  material: number;
  setup: number;
  vectorize: number;
  photo: number;
  engravingCost: number;
  extraAreaCost: number;
  subtotal: number; // Price per item before discount & quantity
  discount: number; // as a percentage, e.g., 0.1 for 10%
  quantity: number;
  total: number; // Final total price for all items
}


// Local representation of an item to be added to the cart
export interface CartItem {
  merchandiseId: string;
  quantity: number;
  attributes: { key: string; value: string; }[];
}


export interface Page {
    title: string;
    content: string;
}

export interface PageContent {
    [key: string]: Page;
}

// Types for Shopify Storefront API (Cart API)
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  }
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image?: {
      url: string;
      altText: string | null;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
    };
  };
  attributes: {
    key: string;
    value: string;
  }[];
}

export interface ShopifyShop {
  name: string;
  description: string | null;
}

// Types for LIVE product data fetched from Shopify
export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string; // This is the GID
  title: string;
  price: ShopifyPrice;
}

export interface ShopifyMetafield {
  key: string;
  value: string;
  type: string;
}

export interface ShopifyProduct {
  id: string; // This is the Product GID
  handle: string;
  title: string;
  variants: {
    edges: {
      node: ShopifyVariant;
    }[];
  };
  featuredImage?: {
    url: string;
  };
  engravingMetafields?: ShopifyMetafield[];
  customMetafields?: ShopifyMetafield[];
}


declare global {
    interface Window {
      fabric: any;
    }
}