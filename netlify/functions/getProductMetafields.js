// netlify/functions/getProductMetafields.js

/**
 * Netlify serverless function to fetch all metafields for a given product
 * from the Shopify Admin API. It's designed to be called with a product GID.
 *
 * Example Usage:
 * GET /.netlify/functions/getProductMetafields?id=gid://shopify/Product/123456789
 */
exports.handler = async function(event, context) {
  // 1. Check for required environment variables for the Admin API
  const { SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN } = process.env;
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    const errorMessage = 'Shopify Admin API credentials (SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN) are not configured on the server.';
    console.error(errorMessage);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }

  // 2. This function should only respond to GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // 3. Get the required product ID from the query parameters
  const productId = event.queryStringParameters.id;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'A product ID (`id`) query parameter is required.' }),
    };
  }

  // 4. Construct the Shopify Admin API endpoint and the GraphQL query
  const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

  const query = `
    query getProductMetafields($id: ID!) {
      product(id: $id) {
        id
        metafields(first: 100) {
          edges {
            node {
              id
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  `;

  // 5. Make the authenticated API call to Shopify
  try {
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: The Admin API uses 'X-Shopify-Access-Token'
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { id: productId },
      }),
    });

    const data = await response.json();

    // 6. Handle any GraphQL errors returned by the Shopify API
    if (data.errors) {
      console.error('Shopify Admin API GraphQL Errors:', JSON.stringify(data.errors, null, 2));
      const errorMessage = data.errors.map((e) => e.message).join(', ');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Shopify API Error: ${errorMessage}` }),
      };
    }
    
    // 7. Specifically handle the case where the product ID does not exist
    if (!data.data || !data.data.product) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: `Product with ID '${productId}' not found.` }),
        };
    }

    // 8. Extract just the metafields array and return it successfully
    const metafields = data.data.product.metafields.edges.map(edge => edge.node);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metafields),
    };

  } catch (error) {
    // 9. Handle network issues or other unexpected errors during the fetch
    console.error('Error fetching from Shopify Admin API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred while contacting Shopify.' }),
    };
  }
};
