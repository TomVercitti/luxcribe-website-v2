// netlify/functions/getProductMetafields.js

/**
 * DEPRECATED: This serverless function is no longer in use.
 * The application has been updated to fetch metafields directly from the Shopify Storefront API.
 * This function now returns a 410 Gone error to prevent its use.
 * See `services/shopify.ts` and `pages/EditorPage.tsx` for the current implementation.
 */
exports.handler = async function(event, context) {
  const errorMessage = 'This serverless function (getProductMetafields) is deprecated and no longer in use. The application has been updated to fetch metafields directly from the Shopify Storefront API. Please update any code that may still be calling this endpoint.';
  
  console.error(errorMessage);
  
  return {
    statusCode: 410, // 410 Gone
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      error: 'Endpoint Deprecated',
      message: errorMessage,
    }),
  };
};
