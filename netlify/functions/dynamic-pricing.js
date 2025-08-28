// netlify/functions/dynamic-pricing.js

/**
 * Netlify serverless function to calculate dynamic engraving price based on
 * artwork dimensions and product-specific metafields from Shopify.
 *
 * It expects a POST request with:
 * {
 *   "productId": "gid://shopify/Product/12345",
 *   "artwork": [
 *     { "width_mm": 50, "height_mm": 20 },
 *     { "width_mm": 30, "height_mm": 30 }
 *   ]
 * }
 */

// Helper to safely parse metafields with defaults
const getMetafieldValue = (metafields, key, type = 'float', defaultValue = 0) => {
    const metafield = metafields.find(m => m.key === key);
    if (!metafield) return defaultValue;
    if (type === 'float') return parseFloat(metafield.value) || defaultValue;
    return metafield.value;
};

exports.handler = async function(event, context) {
    // 1. Check for required environment variables for the Admin API
    const { SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_TOKEN } = process.env;
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Shopify Admin API credentials are not configured.' }) };
    }

    // 2. Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }
    
    const SHOPIFY_ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

    try {
        const { productId, artwork } = JSON.parse(event.body);

        if (!productId || !artwork) {
            return { statusCode: 400, body: JSON.stringify({ error: '`productId` and `artwork` are required.' }) };
        }
        
        // 3. Fetch product metafields from Shopify Admin API (namespaced under "engraving")
        const metafieldsQuery = `
            query getProductMetafields($id: ID!) {
              product(id: $id) {
                metafields(first: 20, namespace: "engraving") {
                  edges {
                    node {
                      key
                      value
                    }
                  }
                }
              }
            }
        `;
        
        const shopifyResponse = await fetch(SHOPIFY_ADMIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
            },
            body: JSON.stringify({
                query: metafieldsQuery,
                variables: { id: productId },
            }),
        });
        
        const shopifyData = await shopifyResponse.json();

        if (shopifyData.errors) {
            throw new Error(shopifyData.errors.map(e => e.message).join(', '));
        }
        if (!shopifyData.data || !shopifyData.data.product) {
            return { statusCode: 404, body: JSON.stringify({ error: `Product with ID '${productId}' not found.` }) };
        }

        const metafields = shopifyData.data.product.metafields.edges.map(edge => edge.node);

        // 4. Parse metafield values needed for calculation, with safe defaults
        const engraving_rate_mm2_per_min = getMetafieldValue(metafields, 'engraving_rate_mm2_per_min', 'float', 1000);
        const included_area_mm2 = getMetafieldValue(metafields, 'included_area_mm2', 'float', 0);
        const labour_rate_per_min = getMetafieldValue(metafields, 'labour_rate_per_min', 'float', 1.0);
        const base_time_overhead_min = getMetafieldValue(metafields, 'base_time_overhead_min', 'float', 5);
        const setup_fee = getMetafieldValue(metafields, 'setup_fee', 'float', 10.0);
        const min_charge = getMetafieldValue(metafields, 'min_charge', 'float', 15.0);

        if (engraving_rate_mm2_per_min <= 0) {
            return { statusCode: 400, body: JSON.stringify({ error: '`engraving_rate_mm2_per_min` metafield must be a positive number.' }) };
        }

        // 5. Calculate total artwork area from the provided array
        const total_artwork_area_mm2 = artwork.reduce((total, item) => {
            const area = (item.width_mm || 0) * (item.height_mm || 0);
            return total + area;
        }, 0);
        
        if (total_artwork_area_mm2 === 0) {
            return { statusCode: 200, body: JSON.stringify({ price: 0 }) };
        }

        // 6. Apply the pricing formula
        const chargeable_area_mm2 = Math.max(0, total_artwork_area_mm2 - included_area_mm2);
        const engraving_time_min = chargeable_area_mm2 / engraving_rate_mm2_per_min;
        const labour_cost = (engraving_time_min * labour_rate_per_min) + (base_time_overhead_min * labour_rate_per_min);
        const total_cost = setup_fee + labour_cost;
        const final_cost = Math.max(total_cost, min_charge);

        // Round to two decimal places
        const finalPrice = Math.round(final_cost * 100) / 100;
        
        // 7. Return the calculated price
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: finalPrice }),
        };

    } catch (error) {
        console.error('Error in dynamic-pricing function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `An internal server error occurred: ${error.message}` }),
        };
    }
};
