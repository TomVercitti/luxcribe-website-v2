import { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '../config';
import type { ShopifyCart, CartItem } from '../types';

// The new API endpoint is our own serverless function. This resolves potential CORS issues,
// hides the access token from client-side network requests, and works consistently in
// both local development (with Netlify Dev) and production.
const SHOPIFY_API_URL = '/.netlify/functions/shopify';


const storefrontApi = async <T>(query: string, variables: Record<string, any> = {}): Promise<T> => {
    const response = await fetch(SHOPIFY_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });
    
    const json = await response.json();

    // Centralized error check: Shopify's GraphQL API almost always returns a 200 OK
    // status but places errors in an `errors` array in the response body.
    if (json.errors) {
        const errorMessage = json.errors.map((e: any) => e.message).join(', ');
        console.error("Shopify GraphQL Errors:", JSON.stringify(json.errors, null, 2));
        // Provide more helpful, user-facing error messages for common issues.
        if (errorMessage.toLowerCase().includes('access denied for storefrontaccesstoken')) {
             throw new Error(`Shopify Auth Error: The Access Token is invalid or missing required permissions. Please check the server configuration.`);
        }
        if (errorMessage.toLowerCase().includes('merchandise')) {
             throw new Error(`Shopify Error: The selected product variant is invalid. Please check the 'variantId' values in constants.ts.`);
        }
        throw new Error(`Shopify GraphQL Error: ${errorMessage}`);
    }

    // This handles errors from our proxy function itself (e.g., missing env vars) or network failures.
    if (!response.ok) {
        console.error("Shopify Proxy Error:", { status: response.status, body: json });
        if (json.error) {
            throw new Error(`Server Error: ${json.error}`);
        }
        throw new Error(`The API request failed with status ${response.status}.`);
    }


    return json.data;
};

const cartFragment = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    lines(first: 250) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                title
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`;

export const createCart = async (): Promise<ShopifyCart | null> => {
    const query = `
        mutation cartCreate($input: CartInput!) {
            cartCreate(input: $input) {
                cart {
                    ...CartFragment
                }
            }
        }
        ${cartFragment}
    `;
    const variables = { input: {} };
    const data = await storefrontApi<{ cartCreate: { cart: ShopifyCart | null } }>(query, variables);
    return data.cartCreate.cart;
};

export const fetchCart = async (cartId: string): Promise<ShopifyCart | null> => {
    const query = `
        query getCart($cartId: ID!) {
            cart(id: $cartId) {
                ...CartFragment
            }
        }
        ${cartFragment}
    `;
    const variables = { cartId };
    const data = await storefrontApi<{ cart: ShopifyCart | null }>(query, variables);
    return data.cart;
};

export const addLinesToCart = async (cartId: string, lines: CartItem[]): Promise<ShopifyCart | null> => {
    const query = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                    ...CartFragment
                }
            }
        }
        ${cartFragment}
    `;
    const shopifyLines = lines.map(item => ({
        merchandiseId: item.merchandiseId,
        quantity: item.quantity,
        attributes: item.attributes,
    }));
    const variables = { cartId, lines: shopifyLines };
    const data = await storefrontApi<{ cartLinesAdd: { cart: ShopifyCart | null } }>(query, variables);
    
    return data.cartLinesAdd.cart;
};

export const removeLinesFromCart = async (cartId: string, lineIds: string[]): Promise<ShopifyCart | null> => {
    const query = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart {
                    ...CartFragment
                }
            }
        }
        ${cartFragment}
    `;
    const variables = { cartId, lineIds };
    const data = await storefrontApi<{ cartLinesRemove: { cart: ShopifyCart | null } }>(query, variables);

    return data.cartLinesRemove.cart;
};


export interface ShopifyShop {
    name: string;
    description: string;
}

export const fetchShopInfo = async (): Promise<ShopifyShop | null> => {
    const query = `
        query getShopInfo {
            shop {
                name
                description
            }
        }
    `;
    try {
        const data = await storefrontApi<{ shop: ShopifyShop }>(query);
        return data.shop;
    } catch (error) {
        console.error("Error fetching shop info:", error);
        throw error; // Re-throw the error to be caught by the UI component
    }
};