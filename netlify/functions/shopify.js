const { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } = process.env;

const SHOPIFY_API_URL = SHOPIFY_STORE_DOMAIN 
    ? `https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`
    : null;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }
  
  if (!SHOPIFY_API_URL || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      console.error('Shopify environment variables are not set.');
      return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Shopify API credentials are not configured on the server.' })
      };
  }

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: event.body,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error in Shopify proxy function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred while contacting Shopify.' }),
    };
  }
};