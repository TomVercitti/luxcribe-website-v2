// ===================================================================================
// !! IMPORTANT !! PLEASE READ !!
// ===================================================================================
//
// This file is the central configuration for connecting to your Shopify store
// during local development.
//
// ACTION REQUIRED:
// 1. Replace the placeholder 'your-store-name.myshopify.com' with your actual
//    Shopify store domain.
// 2. Replace the placeholder 'your-storefront-access-token' with your actual
//    Storefront API access token.
//
// HOW IT WORKS:
// - LOCAL DEVELOPMENT: The application will use the values you enter here.
//   The status indicator in the footer and on the About page will give you
//   immediate feedback on whether these credentials are correct.
//
// - PRODUCTION (Live on Netlify): For security, the live site will IGNORE
//   this file. Instead, it will use environment variables named
//   `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` that you
//   must set in your Netlify site settings.
//
// ===================================================================================

/**
 * Your Shopify store's unique domain.
 * @example 'my-awesome-store.myshopify.com'
 */
export const SHOPIFY_STORE_DOMAIN = 'your-store-name.myshopify.com';

/**
 * Your Shopify Storefront API access token.
 * This is a public token, but it should be treated with care.
 * @example 'shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
 */
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'your-storefront-access-token';