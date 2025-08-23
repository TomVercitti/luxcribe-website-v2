// IMPORTANT: You must set these values as environment variables in your deployment environment (e.g., Netlify).
// The application will not work without these real store details.

// 1. Your actual Shopify store domain (e.g., 'your-store-name.myshopify.com').
export const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';

// 2. Your Shopify Storefront API access token.
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// This check helps diagnose configuration issues early.
if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn(
        '*****************************************************************\n' +
        '** WARNING: Shopify environment variables are missing!         **\n' +
        '** Please set SHOPIFY_STORE_DOMAIN and                         **\n' +
        '** SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment to      **\n' +
        '** connect to your Shopify store.                              **\n' +
        '*****************************************************************'
    );
}