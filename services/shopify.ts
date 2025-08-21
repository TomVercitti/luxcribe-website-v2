import { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '../config';
import type { ShopifyCart, CartItem } from '../types';

// To prevent Cross-Origin (CORS) issues in a buildless setup, we use a public CORS proxy.
// This proxy adds the necessary CORS headers to the Shopify API response, allowing the browser to connect.
// NOTE: For production applications, it is recommended to host your own CORS proxy for security and reliability.
const SHOPIFY_API_URL = `https://corsproxy.io/?https://${SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;


const storefrontApi = async <T>(query: string, variables: Record<string, any> = {}): Promise<T> => {
    const response = await fetch(SHOPIFY_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
        // Handle non-GraphQL errors (e.g., auth, server errors) first.
        console.error("Shopify API HTTP Error:", { status: response.status });
        switch (response.status) {
            case 401:
            case 403:
                throw new Error("Authentication error: Your Shopify Storefront Access Token is likely invalid or missing the required permissions. Please check the token's permissions in your Shopify Admin under 'Storefront API access scopes'.");
            case 404:
                 throw new Error("Store not found: The Shopify Store Domain you provided could not be found. Please double-check it in the `config.ts` file.");
            default:
                 throw new Error(`Shopify API request failed with status ${response.status}. Check your network connection and that your Shopify store is active.`);
        }
    }

    const json = await response.json();

    if (json.errors) {
        const errorMessage = json.errors.map((e: any) => e.message).join(', ');
        console.error("Shopify GraphQL Errors:", JSON.stringify(json.errors, null, 2));
        throw new Error(`Shopify GraphQL Error: ${errorMessage}`);
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
                userErrors {
                    field
                    message
                }
            }
        }
        ${cartFragment}
    `;
    const variables = { input: {} };
    const data = await storefrontApi<{ cartCreate: { cart: ShopifyCart | null, userErrors: { message: string }[] } }>(query, variables);
    
    if (data.cartCreate.userErrors.length > 0) {
        const errorMessage = data.cartCreate.userErrors.map(e => e.message).join(', ');
        console.error("Shopify User Errors (cartCreate):", data.cartCreate.userErrors);
        throw new Error(`Shopify Error: ${errorMessage}`);
    }

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
                userErrors {
                    field
                    message
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
    const data = await storefrontApi<{ cartLinesAdd: { cart: ShopifyCart | null, userErrors: { message: string }[] } }>(query, variables);
    
    if (data.cartLinesAdd.userErrors.length > 0) {
        const errorMessage = data.cartLinesAdd.userErrors.map(e => e.message).join(', ');
        console.error("Shopify User Errors (cartLinesAdd):", data.cartLinesAdd.userErrors);
        // Provide a more helpful error for the most likely problem.
        if (errorMessage.toLowerCase().includes('merchandise')) {
             throw new Error(`Shopify Error: The selected product variant is invalid. Please check the 'variantId' values in constants.ts.`);
        }
        throw new Error(`Shopify Error: ${errorMessage}`);
    }

    return data.cartLinesAdd.cart;
};

export const removeLinesFromCart = async (cartId: string, lineIds: string[]): Promise<ShopifyCart | null> => {
    const query = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart {
                    ...CartFragment
                }
                userErrors {
                    field
                    message
                }
            }
        }
        ${cartFragment}
    `;
    const variables = { cartId, lineIds };
    const data = await storefrontApi<{ cartLinesRemove: { cart: ShopifyCart | null, userErrors: { message: string }[] } }>(query, variables);

    if (data.cartLinesRemove.userErrors.length > 0) {
        const errorMessage = data.cartLinesRemove.userErrors.map(e => e.message).join(', ');
        console.error("Shopify User Errors (cartLinesRemove):", data.cartLinesRemove.userErrors);
        throw new Error(`Shopify Error: ${errorMessage}`);
    }

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