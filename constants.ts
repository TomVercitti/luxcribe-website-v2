import type { Product, PageContent } from './types';

// NOTE: The 'bounds' for engraving zones are based on a canvas size of roughly 800x600.
// These values define the rectangular area where users can add their designs.

export const ENGRAVING_COLORS = [
  { name: 'Deep Black', hex: '#212121' },
  { name: 'Standard Engrave', hex: '#424242' },
  { name: 'Graphite', hex: '#616161' },
  { name: 'Light Slate', hex: '#757575' },
];

export const FONT_FACES = [
  // Serif Fonts
  { name: 'Playfair Display', family: 'Playfair Display' },
  { name: 'Merriweather', family: 'Merriweather' },
  { name: 'Lora', family: 'Lora' },
  { name: 'EB Garamond', family: 'EB Garamond' },
  { name: 'Cormorant Garamond', family: 'Cormorant Garamond' },
  { name: 'Libre Baskerville', family: 'Libre Baskerville' },
  { name: 'Arvo', family: 'Arvo' },
  { name: 'Roboto Slab', family: 'Roboto Slab' },
  { name: 'Slabo 27px', family: 'Slabo 27px' },
  
  // Sans-Serif Fonts
  { name: 'Lato', family: 'Lato' },
  { name: 'Montserrat', family: 'Montserrat' },
  { name: 'Roboto', family: 'Roboto' },
  { name: 'Open Sans', family: 'Open Sans' },
  { name: 'Poppins', family: 'Poppins' },
  { name: 'Oswald', family: 'Oswald' },
  { name: 'Raleway', family: 'Raleway' },
  { name: 'Source Sans Pro', family: 'Source Sans Pro' },
  { name: 'Roboto Condensed', family: 'Roboto Condensed' },
  { name: 'Bebas Neue', family: 'Bebas Neue' },
  { name: 'Anton', family: 'Anton' },

  // Display Fonts
  { name: 'Lobster', family: 'Lobster' },
  { name: 'Pacifico', family: 'Pacifico' },

  // Handwriting Fonts
  { name: 'Dancing Script', family: 'Dancing Script' },
  { name: 'Caveat', family: 'Caveat' },
  { name: 'Sacramento', family: 'Sacramento' },
];

// FIX: Added missing DESIGN_LIBRARY_ITEMS constant to resolve import error.
export const DESIGN_LIBRARY_ITEMS = [
  {
    name: 'Heart',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
  },
  {
    name: 'Star',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
  },
  {
    name: 'Paw Print',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-3.03 0-5.5 2.47-5.5 5.5 0 1.94.99 3.65 2.5 4.63.13.08.26.15.4.21-.08.15-.15.3-.21.45-.98 1.48-2.19 3.3-2.19 5.21 0 2.21 1.79 4 4 4s4-1.79 4-4c0-1.91-1.21-3.73-2.19-5.21-.06-.15-.13-.3-.21-.45.14-.06.27-.13.4-.21 1.51-.98 2.5-2.69 2.5-4.63C17.5 4.47 15.03 2 12 2zm3.5 13c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2zm-7 0c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2zm7-7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-7 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`
  },
  {
    name: 'Coffee Cup',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z"/></svg>`
  },
  {
    name: 'Anchor',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-3.31 0-6 2.69-6 6 0 2.05 1.03 3.84 2.61 4.89l-1.47 1.47C4.41 15.1 3 17.43 3 20c0 1.66 1.34 3 3 3h1c1.1 0 2-.9 2-2v-2h4v2c0 1.1.9 2 2 2h1c1.66 0 3-1.34 3-3 0-2.57-1.41-4.9-4.14-5.64l-1.47-1.47C16.97 11.84 18 10.05 18 8c0-3.31-2.69-6-6-6zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>`
  },
  {
    name: 'Music Note',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`
  },
  {
    name: 'Tree',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L6 8h3v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V8h3l-6-6z"/></svg>`
  },
  {
    name: 'Crown',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM19 18H5v2h14v-2z"/></svg>`
  }
];

export const customerReviews = [
  {
    customerName: 'Jessica L.',
    reviewText: 'The custom slate coasters for our anniversary were perfect. The design process was so easy and they look fantastic!',
    productName: 'Slate Coasters',
    rating: 5,
  },
  {
    customerName: 'Mark T.',
    reviewText: 'I ordered a personalized leather key organizer for my husband and he loves it. The engraving quality is top-notch.',
    productName: 'Leather Key Organizer',
    rating: 5,
  },
  {
    customerName: 'Emily & David',
    reviewText: 'Our wedding favors were a huge hit! Everyone loved the custom heart-shaped coasters. Thank you, Luxcribe!',
    productName: 'Slate Coasters',
    rating: 5,
  },
];

export const customerGalleryItems = [
  {
    imageUrl: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Cicle_430x.webp?v=1755923098#',
    customerName: 'Jessica L.',
    reviewText: 'The custom slate coasters for our anniversary were perfect. The design process was so easy and they look fantastic!',
    productName: 'Slate Coasters',
  },
  {
    imageUrl: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Saccd85451d5a4e13a3c08b983eb1e92e6.webp?v=1755435098',
    customerName: 'Mark T.',
    reviewText: 'I ordered a personalized leather key organizer for my husband and he loves it. The engraving quality is top-notch.',
    productName: 'Leather Key Organizer',
  },
  {
    imageUrl: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Heart_430x.webp?v=1755923137#',
    customerName: 'Emily & David',
    reviewText: 'Our wedding favors were a huge hit! Everyone loved the custom heart-shaped coasters. Thank you, Luxcribe!',
    productName: 'Slate Coasters',
  },
];


// ===================================================================================
// !! IMPORTANT !! PLEASE READ !!
// ===================================================================================
//
// The 'variantId' values below are EXAMPLES and MUST be replaced with your own
// Shopify Product Variant GIDs for the "Add to Cart" functionality to work.
//
// To find your GIDs:
// 1. In your Shopify Admin, go to Products.
// 2. Select a product that has variants.
// 3. Click "Edit" on a variant.
// 4. The number at the very end of the URL in your browser's address bar is the
//    variant's ID. For example, if the URL is:
//    `https://your-store.myshopify.com/admin/products/12345/variants/67890`
//    The variant ID is `67890`.
// 5. Your GID will be: "gid://shopify/ProductVariant/67890"
//
// You must update every `variantId` in the `productCatalog` below.
//
// ===================================================================================

// ===================================================================================
// !! ACTION REQUIRED FOR DYNAMIC ENGRAVING FEES !!
// ===================================================================================
// The new dynamic pricing engine requires a dedicated product in Shopify to handle
// the calculated engraving fee. This method is the standard for the Storefront API.
//
// 1. Create a new product in Shopify named "Custom Engraving Fee".
// 2. Set its price to exactly **$1.00**.
// 3. The calculated fee will be added to the cart by setting the *quantity* of
//    this $1.00 product. (e.g., a $25 fee becomes quantity 25 of this item).
// 4. Get the Variant GID for this product and replace the placeholder below.
// 5. You must also create metafields for your customizable products
//    (e.g., engraving.labour_rate_per_min) for the calculator to use.
// ===================================================================================

export const DYNAMIC_ENGRAVING_FEE_VARIANT_ID = 'gid://shopify/ProductVariant/46968633426165';

export const PRODUCT_FILTERS = {
  type: ['customizable', 'ready-made'],
  material: ['slate', 'leather', 'metal', 'wood', 'glass'],
  occasion: ['wedding', 'pets', 'corporate', 'gifts'],
};

export const PRICE_FILTERS = [
  { label: 'Any Price', value: 'all' },
  { label: 'Under $25', value: '0-25' },
  { label: '$25 to $50', value: '25-50' },
  { label: 'Over $50', value: '50-99999' },
];


export const productCatalog: { [key: string]: Product } = {
  // Drinkware & Barware
  'slate-coasters': {
    id: 'slate-coasters',
    name: 'Slate Coasters (Customizable)',
    category: 'Drinkware & Barware',
    description: 'Natural slate coasters, perfect for protecting surfaces with a rustic, elegant touch. Personalize them with a logo, monogram, or custom design. Each coaster has padded feet to prevent scratching.',
    basePrice: 12.99, // This is a FALLBACK price. The actual price is fetched live from Shopify.
    tags: ['slate', 'wedding', 'corporate', 'gifts'],
    createdAt: '2023-10-26T10:00:00Z',
    type: 'customizable',
    variations: [
      { 
        id: 'slate-coaster-circle', 
        name: 'Circle',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Cicle_430x.webp?v=1755923098#',
        variantId: 'gid://shopify/ProductVariant/46969021497589',
        engravingZones: [{ id: 'center', name: 'Center', px_per_mm: 3, bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      },
      { 
        id: 'slate-coaster-square', 
        name: 'Square',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Square_430x.webp?v=1755923080#',
        variantId: 'gid://shopify/ProductVariant/46969021563125',
        engravingZones: [{ id: 'center', name: 'Center', px_per_mm: 3, bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      },
      { 
        id: 'slate-coaster-hexagon', 
        name: 'Hexagon',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Hexagon_430x.webp?v=1755923152#',
        variantId: 'gid://shopify/ProductVariant/46969021464821',
        engravingZones: [{ id: 'center', name: 'Center', px_per_mm: 3, bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      },
      { 
        id: 'slate-coaster-heart', 
        name: 'Heart',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Heart_430x.webp?v=1755923137#',
        variantId: 'gid://shopify/ProductVariant/46969021530357',
        engravingZones: [{ id: 'center', name: 'Center', px_per_mm: 3, bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      }
    ]
  },
  'whiskey-glass-best-dad': {
    id: 'whiskey-glass-best-dad',
    name: '"Best Dad Ever" Whiskey Glass',
    category: 'Drinkware & Barware',
    type: 'ready-made',
    description: 'A classic heavy-base rocks glass, pre-engraved with "Best Dad Ever". The perfect gift for Father\'s Day, birthdays, or any special occasion. Ready to ship.',
    basePrice: 22.00,
    tags: ['glass', 'gifts', 'ready-made'],
    createdAt: '2024-05-01T10:00:00Z',
    variations: [
      { 
        id: 'whiskey-glass-best-dad-standard', 
        name: '11oz Rocks Glass', 
        material: 'glass', 
        mockupImage: 'https://storage.googleapis.com/gemini-ui-params/12431a4f-d096-41f2-8c85-a9a3f2b6e159.png', 
        variantId: 'gid://shopify/ProductVariant/46974584226037', // Example, replace with real ID
        engravingZones: [] // No engraving zones for ready-made items
      }
    ]
  },
  'leather-key-organizer': {
    id: 'leather-key-organizer',
    name: 'Leather Key Organizer (Customizable)',
    category: 'Keychains & Accessories',
    description: 'A smart and stylish leather keychain to keep your keys organized and protected. Personalize it with your initials, a name, or a small logo.',
    basePrice: 27.99, // This is a FALLBACK price. The actual price is fetched live from Shopify.
    tags: ['leather', 'corporate', 'pets', 'gifts'],
    createdAt: '2023-11-15T12:00:00Z',
    type: 'customizable',
    variations: [
      { 
        id: 'leather-key-organizer-black', 
        name: 'Black Leather',
        colorHex: '#2f2f2f',
        material: 'leather',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Saccd85451d5a4e13a3c08b983eb1e92e6.webp?v=1755435098',
        variantId: 'gid://shopify/ProductVariant/46958815281397',
        engravingZones: [{ id: 'front', name: 'Front', px_per_mm: 4, bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
      },
      { 
        id: 'leather-key-organizer-brown', 
        name: 'Brown Leather',
        colorHex: '#8b4513',
        material: 'leather',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S9e94de1e9a794829a6523d0d1f47408fg.webp?v=1755435098',
        variantId: 'gid://shopify/ProductVariant/46958815314165',
        engravingZones: [{ id: 'front', name: 'Front', px_per_mm: 4, bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
      },
      { 
        id: 'leather-key-organizer-blue', 
        name: 'Blue Leather',
        colorHex: '#0d2d4e',
        material: 'leather',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Sf177634ae202406fae7158ffd2c5d407n.webp?v=1755435097',
        variantId: 'gid://shopify/ProductVariant/46958815248629',
        engravingZones: [{ id: 'front', name: 'Front', px_per_mm: 4, bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
      },
      { 
        id: 'leather-key-organizer-red', 
        name: 'Red Leather',
        colorHex: '#a02c2c',
        material: 'leather',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S50b87f31fd2c41578320161d35d492709.webp?v=1755435098',
        variantId: 'gid://shopify/ProductVariant/46958815346933',
        engravingZones: [{ id: 'front', name: 'Front', px_per_mm: 4, bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
      }
    ]
  },
  'metal-business-cards': {
    id: 'metal-business-cards',
    name: 'Metal Business Cards (Customizable)',
    category: 'Office & Stationery',
    description: 'Make a lasting impression with premium, laser-engraved metal business cards. Durable, unique, and fully customizable on both sides. This pack includes 50 cards.',
    basePrice: 37.99,
    tags: ['metal', 'corporate'],
    createdAt: '2024-01-20T14:30:00Z',
    type: 'customizable',
    variations: [
      { 
        id: 'mbc-rose-gold', 
        name: 'Rose Gold',
        colorHex: '#b76e79',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S8f19d989cf7e4809bb17bfa1eed83bcbN_430x.webp?v=1755933870#',
        variantId: 'gid://shopify/ProductVariant/46974554013941',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-black', 
        name: 'Black',
        colorHex: '#000000',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S413680f4d9154642a8709de9cdf60c57I_430x.webp?v=1755933870#',
        variantId: 'gid://shopify/ProductVariant/46974553850101',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-matte-black', 
        name: 'Matte Black',
        colorHex: '#2f2f2f',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S34b021b7b6d34369a63c64ca46f4915dt_430x.webp?v=1755933871#',
        variantId: 'gid://shopify/ProductVariant/46974553882869',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-gold', 
        name: 'Gold',
        colorHex: '#ffd700',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S1ab1d5688c854687a67671043ceb872ck_430x.webp?v=1755933871#',
        variantId: 'gid://shopify/ProductVariant/46974553817333',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-silver', 
        name: 'Silver',
        colorHex: '#c0c0c0',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S78c13580d82b4794977cfd301b7e836cl_430x.webp?v=1755933871#',
        variantId: 'gid://shopify/ProductVariant/46974553981173',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-red', 
        name: 'Red',
        colorHex: '#a02c2c',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Sa6f9f7e533c44479a41fde0cf67d64c0d_430x.webp?v=1755933871#',
        variantId: 'gid://shopify/ProductVariant/46974553915637',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-purple', 
        name: 'Purple',
        colorHex: '#5a3e8a',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S33f3541a914a49d18a774cd960f26ad5Z_430x.webp?v=1755933870#',
        variantId: 'gid://shopify/ProductVariant/46974553948405',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
      { 
        id: 'mbc-green', 
        name: 'Green',
        colorHex: '#3e8a5a',
        material: 'metal',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S0041519b03924a0bb1270cca1a68deb5U_430x.webp?v=1755933871#',
        variantId: 'gid://shopify/ProductVariant/46974554046709',
        engravingZones: [
            { id: 'front', name: 'Front Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } },
            { id: 'back', name: 'Back Side', px_per_mm: 6.7, bounds: { x: 100, y: 128, width: 600, height: 343 } }
        ] 
      },
    ]
  },
};

export const pageContent: PageContent = {
    faq: { 
        title: "Frequently Asked Questions", 
        content: `
            <h2>Ordering & Design</h2>
            <p><strong>What file types do you accept for custom uploads?</strong></p>
            <p>We strongly prefer vector files (SVG, AI, EPS, PDF) for the cleanest results, especially for logos and text. For images and photos, we accept high-resolution raster files (PNG, JPEG) at 300 DPI. Please ensure your files adhere to the guidelines in our Terms of Service.</p>
            <p><strong>How long does it take to process a personalized order?</strong></p>
            <p>Standard processing time, which includes design setup and engraving, is typically 4–5 business days before the item is shipped. This does not include shipping time.</p>
            
            <h2>Shipping & Delivery</h2>
            <p><strong>How can I track my order?</strong></p>
            <p>Once your order has been dispatched, you will receive a shipping confirmation email that includes a tracking number and a link to the carrier's website.</p>
        ` 
    },
    "track-order": { 
        title: "Track Your Order", 
        content: `
            <h2>How It Works</h2>
            <p>Once your order is engraved, packaged, and dispatched from our workshop, our system will automatically send you a shipping confirmation email.</p>
            <p>This email will contain a unique tracking number and a link to the Australia Post tracking portal. Please allow up to 24 hours for the tracking information to become active after you receive the email.</p>
            
            <h2>Can't Find Your Email?</h2>
            <p>If you haven't received a shipping confirmation email within 5 business days of placing your order, please check your spam or junk folder. If you still can't find it, please contact our customer support team with your order number, and we'll be happy to assist.</p>
        ` 
    },
    shipping: { 
        title: "Shipping & Delivery", 
        content: `
            <h2>Order Processing Time</h2>
            <p>All personalized and custom-engraved items require a processing time of <strong>4–5 business days</strong>. This period allows our team to meticulously review your design, prepare the materials, and execute the engraving with the highest level of precision. Business days are Monday through Friday and exclude public holidays.</p>
            
            <h2>Domestic Shipping (Australia)</h2>
            <p>All domestic shipments are sent via Australia Post. At checkout, you may have the option to choose from the following services:</p>
            <ul>
                <li><strong>Standard Post:</strong> Typically arrives within 3-7 business days after dispatch.</li>
                <li><strong>Express Post:</strong> Typically arrives within 1-3 business days after dispatch for most metro areas.</li>
            </ul>
            <p>Please note that these are estimated delivery times provided by the carrier and are not guaranteed. Rural and remote areas may experience longer delivery times.</p>
            
            <h2>Shipping Costs</h2>
            <p>Shipping costs are calculated automatically at the checkout page based on the weight of your order and your location. You will be able to review the shipping cost before confirming your order.</p>
        ` 
    },
    returns: { 
        title: "Returns & Refunds Policy", 
        content: `
            <h2>Custom & Personalised Items</h2>
            <p>Due to the unique, custom nature of our engraved products, we are unable to offer returns or refunds for change of mind. Each item is created specifically for you. We strongly encourage you to double-check all text, dates, and design choices in the editor before finalizing your order.</p>
            
            <h2>Damaged, Faulty, or Incorrect Items</h2>
            <p>We take great pride in our work, but in the rare event that your item arrives damaged, faulty, or is incorrect due to an error on our part, please contact us within <strong>7 days</strong> of receiving your order.</p>
            <p>To help us resolve the issue quickly, please email us with the following information:</p>
            <ul>
                <li>Your full name and order number.</li>
                <li>A clear description of the issue.</li>
                <li>High-quality photos showing the damage, fault, or incorrect engraving.</li>
            </ul>
            <p>Upon review, we will arrange for a replacement or a full refund at no additional cost to you.</p>
            
            <h2>Cancellations</h2>
            <p>If you need to cancel your order, please contact us as soon as possible. We can only accommodate cancellations if your order has not yet entered the production (engraving) phase.</p>
        ` 
    },
    privacy: { 
        title: "Privacy Policy", 
        content: `
            <p>Your privacy is important to us. This policy explains what information we collect and how we use it.</p>
            <h2>Information We Collect</h2>
            <ul>
                <li><strong>Contact Information:</strong> Your name, email address, phone number, and postal address.</li>
                <li><strong>Order Information:</strong> Details of the products you purchase, including customization details and artwork files you upload.</li>
                <li><strong>Payment Information:</strong> We use Shopify Payments, a secure third-party payment processor. We do not store your credit card details on our servers.</li>
                <li><strong>Communication:</strong> Any correspondence you have with us via email or our contact forms.</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <ul>
                <li>To process and fulfill your orders, including engraving and shipping.</li>
                <li>To communicate with you about your order status, inquiries, and customer support requests.</li>
                <li>To improve our products and services.</li>
            </ul>
            
            <h2>Data Sharing</h2>
            <p>We only share your information with essential third parties required to run our business, including:</p>
            <ul>
                <li><strong>Shopify:</strong> To power our online store and process orders.</li>
                <li><strong>Shipping Carriers:</strong> Such as Australia Post, to deliver your orders.</li>
                <li><strong>Formspree:</strong> To handle our custom quote and contact form submissions.</li>
            </ul>
            <p>We do not sell your personal information to any third parties.</p>
        ` 
    },
    terms: { 
        title: "Terms of Service", 
        content: `
            <p>By placing an order with Luxcribe, you agree to the following Terms and Conditions.</p>
            
            <h2>1. Online Design Tool & Previews</h2>
            <p>The product customizer on our website is a powerful tool designed to provide a high-fidelity digital mockup of your final product. However, it is important to understand that this is a <strong>visual guide and not an exact replica</strong>.</p>
            <p>The final appearance of the engraving can vary slightly due to factors such as:</p>
            <ul>
                <li>The natural grain and texture of the material (wood, leather, slate, etc.).</li>
                <li>The physical limitations and characteristics of the laser engraving process.</li>
                <li>Minor scaling and positioning adjustments made by our technicians to ensure the best possible outcome.</li>
            </ul>
            <p>By ordering, you acknowledge that the final product may have minor variations from the on-screen preview and that this does not constitute a product fault.</p>
            
            <h2>2. User-Submitted Artwork & Files</h2>
            <p>You are solely responsible for the quality and content of any artwork, logos, or images you upload.</p>
            <ul>
                <li><strong>File Quality:</strong> For best results, you must adhere to our file guidelines. We are not responsible for poor engraving quality resulting from low-resolution images, incorrect file formats, or designs with elements that are too thin or complex to engrave cleanly.</li>
                <li><strong>File Requirements:</strong> For SVGs, all text must be converted to outlines/paths, and overlapping shapes must be merged. For PNGs, the background must be transparent.</li>
                <li><strong>Content Rights:</strong> By uploading a design, you represent and warrant that you have the legal right to use, reproduce, and display the content. You agree to indemnify Luxcribe against any claims of copyright or trademark infringement.</li>
                <li><strong>Right to Refuse:</strong> We reserve the right to refuse any order that contains content that is illegal, hateful, or violates intellectual property rights.</li>
            </ul>
            
            <h2>3. Orders & Payment</h2>
            <p>All payments are processed securely through Shopify Payments. Order fulfillment is subject to payment confirmation and our standard processing times as outlined on our Shipping & Delivery page.</p>
            
            <h2>4. Limitation of Liability</h2>
            <p>Luxcribe shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
        ` 
    }
};