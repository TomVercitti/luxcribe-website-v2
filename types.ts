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
  basePrice: number;
  variations: ProductVariation[];
}

export interface PriceDetails {
  base: number;
  text: number;
  images: number;
  total: number;
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


declare global {
    interface Window {
      fabric: any;
    }
}
