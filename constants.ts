import type { Product, PageContent } from './types';

// NOTE: The 'bounds' for engraving zones are based on a canvas size of roughly 800x600.
// These values define the rectangular area where users can add their designs.

export const TEXT_ENGRAVING_TIERS = [
  { min: 1, max: 5, price: 25.00, variantId: 'gid://shopify/ProductVariant/46968651546869' },
  { min: 6, max: 10, price: 30.00, variantId: 'gid://shopify/ProductVariant/46968711971061' },
  { min: 11, max: 20, price: 40.00, variantId: 'gid://shopify/ProductVariant/46968707907829' },
  { min: 21, max: 30, price: 50.00, variantId: 'gid://shopify/ProductVariant/46968712954101' },
  { min: 31, max: 50, price: 60.00, variantId: 'gid://shopify/ProductVariant/46968714100981' },
];

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

export const DESIGN_LIBRARY_ITEMS = [
  {
    name: 'Heart',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>`
  },
  {
    name: 'Star',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>`
  },
  {
    name: 'Paw Print',
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="currentColor"><path d="M78.1,53.3c-2.3-1.2-5.1-1-7.2,0.6c-2.1,1.6-3,4.2-2.3,6.7c1.7,5.9,3.8,11.7,6.3,17.2c1.2,2.6,3.9,4.2,6.7,3.9 c2.8-0.3,5.1-2.4,5.4-5.2c1.1-7.7,1.1-15.5-0.1-23.2C85.5,50.1,81.9,50.2,78.1,53.3z"/><path d="M49.8,55c-2.1-1.3-4.8-1.4-6.9-0.3c-2.1,1.1-3.6,3.1-4.2,5.4c-2.2,8.3-2,16.7-0.1,25c0.5,2.3,2.4,4.2,4.8,4.6 c2.4,0.4,4.8-0.7,6.1-2.7c2.5-3.8,4.5-7.9,5.9-12.1C56.6,68.9,5.1,60.5,49.8,55z"/><path d="M21.5,53.7c-3.7-3.1-9-2-11.4,2.5c-2.4,4.5-1,10.1,3,13.1c1.9,1.4,4.2,2.1,6.5,2c2.5-0.1,4.9-1.3,6.5-3.2 c3.4-4,5.4-8.8,6.3-13.8C33,51.8,27.3,49.3,21.5,53.7z"/><path d="M51.2,16.2c-5.7-0.4-11.2,2-14.8,6.2c-4.9,5.7-6,13.6-2.8,20.3c3.2,6.7,9.6,11.2,16.9,11.2c7.1,0,13.4-4.4,16.5-10.9 c3.1-6.5,2.1-14.3-2.6-20.1C60.2,17.8,55.8,16.4,51.2,16.2z"/></svg>`
  },
  {
    name: 'Mountains',
    svg: `<svg viewBox="0 0 512 512" width="100%" height="100%" fill="currentColor"><path d="M304 256h-96v-32h96v32zm-160 0H48v-32h96v32zm320-96v32h-96v-32h96zM32 416h448v-32H32v32zm160-256h-32v32h32v-32zM32 224v-32h64v32H32zm128 64H32v32h128v-32zm32-128V32h-32v128h32zM320 96V32h-32v64h32zm64-64h-32v64h32V32zm-32 256h-32v32h32v-32zm-64-64v32h-32v-32h32zm160-32v32h-32v-32h32zm32 128h-32v32h32v-32z"/></svg>`
  },
  {
    name: 'Coffee Cup',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M18.5,8H17V6A1,1 0 0,0 16,5H4A1,1 0 0,0 3,6V16A1,1 0 0,0 4,17H16A1,1 0 0,0 17,16V14H18.5A2.5,2.5 0 0,0 21,11.5A2.5,2.5 0 0,0 18.5,8Z" /></svg>`
  },
  {
    name: 'Anchor',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12,2A9,9 0 0,0 3,11C3,14.04 4.5,16.81 7,18.81V21A1,1 0 0,0 8,22H9A1,1 0 0,0 10,21V19H14V21A1,1 0 0,0 15,22H16A1,1 0 0,0 17,21V18.81C19.5,16.81 21,14.04 21,11A9,9 0 0,0 12,2M12,5A2,2 0 0,1 14,7A2,2 0 0,1 12,9A2,2 0 0,1 10,7A2,2 0 0,1 12,5M12,16A5,5 0 0,1 7,11H17A5,5 0 0,1 12,16Z" /></svg>`
  },
  {
    name: 'Snowflake',
    svg: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12,2L9.18,4.73L9.67,8.5L6.61,10.27L5.83,6.59L3,7.92L4.29,11.5L1,12L4.29,12.5L3,16.08L5.83,17.41L6.61,13.73L9.67,15.5L9.18,19.27L12,22L14.82,19.27L14.33,15.5L17.39,13.73L18.17,17.41L21,16.08L19.71,12.5L23,12L19.71,11.5L21,7.92L18.17,6.59L17.39,10.27L14.33,8.5L14.82,4.73L12,2Z" /></svg>`
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
// !! ACTION REQUIRED FOR ENGRAVING FEES !!
// ===================================================================================
// To enable adding engraving fees to the cart, you must:
// 1. Create a product in your Shopify store to represent the engraving fee tiers.
//    This product should have variants corresponding to each tier in `TEXT_ENGRAVING_TIERS`.
//    - Example Variant Name: "Text Engraving (1-5 Characters)", Price: $25.00
//    - Example Variant Name: "Text Engraving (6-10 Characters)", Price: $30.00
// 2. Create a separate product for "Image Engraving Fee". This product's price in Shopify
//    will be overridden by the dynamically calculated price, so you can set it to $0 or a base fee.
// 3. Get the Variant GID for each of these new variants/products.
// 4. Replace the placeholder GIDs in `TEXT_ENGRAVING_TIERS` and `IMAGE_FEE_PRODUCT_VARIANT_ID`.
// ===================================================================================

export const IMAGE_FEE_PRODUCT_VARIANT_ID = 'gid://shopify/ProductVariant/46968633426165';


export const productCatalog: { [key: string]: Product } = {
  // Home Decor
  'slate-coasters': {
    id: 'slate-coasters',
    name: 'Slate Coasters',
    category: 'Home Decor',
    description: 'Natural slate coasters, perfect for protecting surfaces with a rustic, elegant touch. Personalize them with a logo, monogram, or custom design. Each coaster has padded feet to prevent scratching.',
    basePrice: 12.00,
    variations: [
      { 
        id: 'slate-coaster-hexagon', 
        name: 'Hexagon',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/slate-coaster-hexagon.png?v=1755435099',
        variantId: 'gid://shopify/ProductVariant/46969021464821',
        engravingZones: [{ id: 'center', name: 'Center', bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      },
      { 
        id: 'slate-coaster-circle', 
        name: 'Circle',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/slate-coaster-circle.png?v=1755435099',
        variantId: 'gid://shopify/ProductVariant/46969021497589',
        engravingZones: [{ id: 'center', name: 'Center', bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      },
      { 
        id: 'slate-coaster-heart', 
        name: 'Heart',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/slate-coaster-heart.png?v=1755435099',
        variantId: 'gid://shopify/ProductVariant/46969021530357',
        engravingZones: [{ id: 'center', name: 'Center', bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      },
      { 
        id: 'slate-coaster-square', 
        name: 'Square',
        material: 'slate',
        mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/slate-coaster-square.png?v=1755435099',
        variantId: 'gid://shopify/ProductVariant/46969021563125',
        engravingZones: [{ id: 'center', name: 'Center', bounds: { x: 250, y: 150, width: 300, height: 300 } }] 
      }
    ]
  },
  // Drinkware & Barware
  /*
  'tumbler': {
    id: 'tumbler',
    name: '20oz Insulated Tumbler',
    category: 'Drinkware & Barware',
    description: 'Keep your drinks at the perfect temperature for hours. This powder-coated stainless steel tumbler is durable, stylish, and ready for your custom design. Includes a clear, spill-resistant lid.',
    basePrice: 25.00,
    variations: [
      { id: 'tumbler-black', name: 'Matte Black', colorHex: '#2f2f2f', material: 'metal', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/f929f225-b4f0-4a87-a2f0-111e13a0c511.png', variantId: 'gid://shopify/ProductVariant/46958815379701', engravingZones: [{id: 'front', name: 'Front', bounds: { x: 250, y: 150, width: 300, height: 300 }}] },
      { id: 'tumbler-white', name: 'White', colorHex: '#ffffff', material: 'metal', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/40960010-344f-406a-a82a-2831b8c08973.png', variantId: 'gid://shopify/ProductVariant/46958815412469', engravingZones: [{id: 'front', name: 'Front', bounds: { x: 250, y: 150, width: 300, height: 300 }}] },
      { id: 'tumbler-blue', name: 'Navy Blue', colorHex: '#0d2d4e', material: 'metal', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/56b7c0d2-0158-45b7-a3f1-d10100414605.png', variantId: 'gid://shopify/ProductVariant/46958815445237', engravingZones: [{id: 'front', name: 'Front', bounds: { x: 250, y: 150, width: 300, height: 300 }}] },
    ],
  },
  */
  /*
  'whiskey-glass': {
    id: 'whiskey-glass',
    name: 'Engraved Whiskey Glass',
    category: 'Drinkware & Barware',
    description: 'A classic heavy-base rocks glass, perfect for whiskey or cocktails. Add a monogram, name, or logo for a sophisticated touch.',
    basePrice: 18.00,
    variations: [
      { id: 'whiskey-glass-standard', name: '11oz Rocks Glass', material: 'glass', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/8a728b9c-2b28-48b8-a664-9a8c7b848c9c.png', variantId: 'gid://shopify/ProductVariant/45000000000004', engravingZones: [{ id: 'front', name: 'Front', bounds: { x: 275, y: 200, width: 250, height: 200 } }] }
    ]
  },
  // Cutting Boards & Kitchenware
  'cutting-board': {
    id: 'cutting-board',
    name: 'Bamboo Cutting Board',
    category: 'Cutting Boards & Kitchenware',
    description: 'A durable and eco-friendly bamboo cutting board, perfect for chopping or as a serving platter. Personalize it with a name, date, or custom design.',
    basePrice: 35.00,
    variations: [
      { id: 'cutting-board-large', name: 'Large (15" x 11")', material: 'wood', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/aa4f63c8-5014-4171-a477-8c38686d1a10.png', variantId: 'gid://shopify/ProductVariant/45000000000005', engravingZones: [{ id: 'front', name: 'Front', bounds: { x: 100, y: 100, width: 600, height: 400 } }] }
    ]
  },
  */
  // Keychains & Accessories
  'leather-key-pouch': {
  id: 'leather-key-pouch',
  name: 'Leather Key Organizer',
  category: 'Keychains & Accessories',
  description: 'A smart and stylish leather pouch to keep your keys organized and protected. Personalize it with your initials, a name, or a small logo.',
  basePrice: 13.56,
  variations: [
    { 
      id: 'leather-key-pouch-black', 
      name: 'Black Leather',
      colorHex: '#2f2f2f',
      material: 'leather',
      mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Saccd85451d5a4e13a3c08b983eb1e92e6.webp?v=1755435098',
      variantId: 'gid://shopify/ProductVariant/46958815281397',
      engravingZones: [{ id: 'front', name: 'Front', bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
    },
    { 
      id: 'leather-key-pouch-brown', 
      name: 'Brown Leather',
      colorHex: '#8b4513',
      material: 'leather',
      mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S9e94de1e9a794829a6523d0d1f47408fg.webp?v=1755435098',
      variantId: 'gid://shopify/ProductVariant/46958815314165',
      engravingZones: [{ id: 'front', name: 'Front', bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
    },
    { 
      id: 'leather-key-pouch-blue', 
      name: 'Blue Leather',
      colorHex: '#0d2d4e',
      material: 'leather',
      mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/Sf177634ae202406fae7158ffd2c5d407n.webp?v=1755435097',
      variantId: 'gid://shopify/ProductVariant/46958815248629',
      engravingZones: [{ id: 'front', name: 'Front', bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
    },
    { 
      id: 'leather-key-pouch-red', 
      name: 'Red Leather',
      colorHex: '#a02c2c',
      material: 'leather',
      mockupImage: 'https://cdn.shopify.com/s/files/1/0762/2433/2021/files/S50b87f31fd2c41578320161d35d492709.webp?v=1755435098',
      variantId: 'gid://shopify/ProductVariant/46958815346933',
      engravingZones: [{ id: 'front', name: 'Front', bounds: { x: 250, y: 300, width: 300, height: 150 } }] 
    }
  ]

  },
  /*
  // Photo Frames & Albums
  'photo-frame': {
    id: 'photo-frame',
    name: 'Wooden Photo Frame',
    category: 'Photo Frames & Albums',
    description: 'A classic wooden photo frame that adds a warm, personal touch to any picture. Engrave a message, date, or name along the bottom or top.',
    basePrice: 22.00,
    variations: [
      { id: 'photo-frame-5x7', name: 'For 5x7 Photo', material: 'wood', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/7f2f116a-0498-4228-a664-d396a84f3e6c.png', variantId: 'gid://shopify/ProductVariant/45000000000011', engravingZones: [{ id: 'bottom', name: 'Bottom Edge', bounds: { x: 150, y: 450, width: 500, height: 80 } }, { id: 'top', name: 'Top Edge', bounds: { x: 150, y: 70, width: 500, height: 80 } }] }
    ]
  },
  // Wedding & Event Items
  'wedding-sign': {
    id: 'wedding-sign',
    name: 'Acrylic Wedding Sign',
    category: 'Wedding & Event Items',
    description: 'An elegant clear acrylic sign to welcome your guests, display a menu, or share a seating chart. Engraving creates a beautiful frosted effect.',
    basePrice: 75.00,
    variations: [
      { id: 'wedding-sign-clear', name: '18x24 Clear Acrylic', material: 'glass', mockupImage: 'https://storage.googleapis.com/gemini-ui-params/7f9411e7-f138-4e31-8633-5d518f813a37.png', variantId: 'gid://shopify/ProductVariant/45000000000012', engravingZones: [{ id: 'full', name: 'Full Area', bounds: { x: 100, y: 100, width: 600, height: 400 } }] }
    ]
  },
  */
};

export const pageContent: PageContent = {
    faq: { title: "Frequently Asked Questions", content: `<h2>How long do orders take?</h2><p>Processing (engraving) time for personalised items is 4–5 business days.</p><h2>What file types do you accept?</h2><p>Preferred: vector files (SVG, AI, EPS, PDF). High-resolution raster files (PNG, JPEG) at 300 DPI are acceptable.</p>` },
    "track-order": { title: "Track Your Order", content: `<p>You will receive an email with tracking info once your order ships.</p>` },
    shipping: { title: "Shipping & Delivery", content: `<h2>Processing time</h2><p>4–5 business days for personalised items.</p><h2>Carriers</h2><p>Domestic shipments are sent via Australia Post.</p>` },
    returns: { title: "Returns & Refunds", content: `<h2>Personalised items</h2><p>Custom / personalised products are not eligible for change-of-mind returns.</p><h2>Faulty/damaged items</h2><p>If an item is faulty or damaged in transit, please email us with photos and your order number.</p>` },
    privacy: { title: "Privacy Policy", content: `<h2>What we collect</h2><ul><li>Name, email, phone, postal address</li><li>Order details & artwork files</li></ul>` },
    terms: { title: "Terms of Service", content: `<h2>Acceptance</h2><p>By placing an order with Luxcribe you agree to these Terms.</p>` }
};