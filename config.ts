// IMPORTANT: You must update these values in this file.
// These are placeholders and the application will not work without your real store details.

// 1. Replace with your actual Shopify store domain.
export const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'dbrd1n-q5.myshopify.com';

// 2. Replace with your Shopify Storefront API access token.
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '1a750a6e9f32c3f35b53e6b796956bde';

// This check helps diagnose configuration issues early.
if (SHOPIFY_STORE_DOMAIN.includes('YOUR_STORE_NAME') || SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes('YOUR_STOREFRONT_API_ACCESS_TOKEN')) {
    console.warn(
        '*****************************************************************\n' +
        '** WARNING: Shopify configuration is incomplete!               **\n' +
        '** Please update SHOPIFY_STORE_DOMAIN and                      **\n' +
        '** SHOPIFY_STOREFRONT_ACCESS_TOKEN in `config.ts` to connect   **\n' +
        '** to your Shopify store.                                      **\n' +
        '*****************************************************************'
    );
}
