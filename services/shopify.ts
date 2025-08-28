import type { ShopifyCart, CartItem, ShopifyShop, ShopifyProduct } from '../types';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '../config';

/**
 * A generic fetch helper for the Shopify Storefront API.
 * It makes direct API calls to Shopify using credentials from config.ts,
 * which is suitable for local development. For production, ensure CORS is handled
 * or use a server-side proxy.
 */
const storefrontApi = async <T>(
    query: string,
    variables: Record<string, any> = {},
    customDomain?: string, // Used ONLY for the connection tester
    customToken?: string   // Used ONLY for the connection tester
): Promise<T> => {
    const isTestConnection = !!(customDomain && customToken);
    
    const domain = customDomain || SHOPIFY_STORE_DOMAIN;
    const token = customToken || SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    const endpoint = `https://${domain}/api/2024-04/graphql.json`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query, variables }),
        });

        const json = await response.json();

        if (json.errors) {
            const errorMessage = json.errors.map((e: any) => e.message).join(', ');
            console.error("Shopify GraphQL Errors:", JSON.stringify(json.errors, null, 2));
            if (errorMessage.toLowerCase().includes('access denied')) {
                 throw new Error(`Shopify Auth Error: The Access Token is invalid or missing permissions. Please check your credentials and Shopify admin settings.`);
            }
            if (errorMessage.toLowerCase().includes('merchandise')) {
                 throw new Error(`Shopify Error: A selected product variant is invalid. Please check the 'variantId' values in constants.ts and ensure they exist in your Shopify store.`);
            }
            throw new Error(`Shopify GraphQL Error: ${errorMessage}`);
        }

        if (!response.ok) {
            console.error("Shopify API Error:", { status: response.status, body: json });
            const errorText = json.error || `The API request failed with status ${response.status}.`;
            throw new Error(errorText);
        }
        
        return json.data;
    } catch (error: any) {
        console.error("Shopify API call failed:", error);
        throw new Error(`Failed to fetch from Shopify API at ${domain}. Check your network connection, CORS settings, and Shopify credentials. ${error.message}.`);
    }
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
              image {
                url
                altText
              }
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
                cart { ...CartFragment }
            }
        }
        ${cartFragment}
    `;
    const data = await storefrontApi<{ cartCreate: { cart: ShopifyCart | null } }> (query, { input: {} });
    return data.cartCreate.cart;
};

export const fetchCart = async (cartId: string): Promise<ShopifyCart | null> => {
    const query = `
        query getCart($cartId: ID!) {
            cart(id: $cartId) { ...CartFragment }
        }
        ${cartFragment}
    `;
    const data = await storefrontApi<{ cart: ShopifyCart | null }>(query, { cartId });
    return data.cart;
};

export const addLinesToCart = async (cartId: string, lines: CartItem[]): Promise<ShopifyCart | null> => {
    const query = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart { ...CartFragment }
            }
        }
        ${cartFragment}
    `;
    const shopifyLines = lines.map(item => ({
        merchandiseId: item.merchandiseId,
        quantity: item.quantity,
        attributes: item.attributes,
    }));
    const data = await storefrontApi<{ cartLinesAdd: { cart: ShopifyCart | null } }>(query, { cartId, lines: shopifyLines });
    return data.cartLinesAdd.cart;
};

export const removeLinesFromCart = async (cartId: string, lineIds: string[]): Promise<ShopifyCart | null> => {
    const query = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart { ...CartFragment }
            }
        }
        ${cartFragment}
    `;
    const data = await storefrontApi<{ cartLinesRemove: { cart: ShopifyCart | null } }>(query, { cartId, lineIds });
    return data.cartLinesRemove.cart;
};

export const fetchShopInfo = async (domain: string, token: string): Promise<ShopifyShop | null> => {
    const query = `query getShopInfo { shop { name, description } }`;
    const data = await storefrontApi<{ shop: ShopifyShop | null }>(query, {}, domain, token);
    return data.shop;
};

// Fragment for product data, including variants and prices
const productWithVariantsFragment = `
  fragment ProductWithVariants on Product {
    id
    handle
    title
    variants(first: 25) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
        }
      }
    }
    engravingMetafields: metafields(identifiers: [
      {namespace: "engraving", key: "material_cost"},
      {namespace: "engraving", key: "setup_fee"},
      {namespace: "engraving", key: "vectorize_fee"},
      {namespace: "engraving", key: "photo_fee"},
      {namespace: "engraving", key: "engraving_rate_mm2_per_min"},
      {namespace: "engraving", key: "base_time_overhead_min"},
      {namespace: "engraving", key: "labour_rate_per_min"},
      {namespace: "engraving", key: "included_area_mm2"},
      {namespace: "engraving", key: "area_rate"},
      {namespace: "engraving", key: "min_charge"},
      {namespace: "engraving", key: "bulk_tiers"},
      {namespace: "engraving", key: "quickbuy_fixed_price"}
    ]) {
      key
      value
      type
    }
  }
`;

export const fetchProductsByHandles = async (handles: string[]): Promise<ShopifyProduct[]> => {
    const handlesQueryString = handles.map(h => `handle:'${h}'`).join(' OR ');
    const query = `
        query getProductsByHandles($query: String!) {
            products(first: ${handles.length}, query: $query) {
                edges {
                    node {
                        ...ProductWithVariants
                    }
                }
            }
        }
        ${productWithVariantsFragment}
    `;
    const data = await storefrontApi<{ products: { edges: { node: ShopifyProduct }[] } }>(
        query,
        { query: handlesQueryString }
    );
    return data.products.edges.map(edge => edge.node);
};

// New fragment and function for fetching 'custom' metafields for the coaster customizer.
const productWithCustomMetafieldsFragment = `
  fragment ProductWithCustomMetafields on Product {
    id
    handle
    title
    variants(first: 1) {
      edges {
        node {
          id
          price {
            amount
            currencyCode
          }
        }
      }
    }
    customMetafields: metafields(identifiers: [
      {namespace: "custom", key: "base_price"},
      {namespace: "custom", key: "included_area_mm2"},
      {namespace: "custom", key: "engraving_rate_mm2_per_min"},
      {namespace: "custom", key: "labour_rate_per_min"},
      {namespace: "custom", key: "setup_fee"},
      {namespace: "custom", key: "material_cost"},
      {namespace: "custom", key: "min_charge"}
    ]) {
      key
      value
      type
    }
  }
`;

export const fetchProductWithCustomMetafields = async (handle: string): Promise<ShopifyProduct | null> => {
    const query = `
        query getProduct($handle: String!) {
            product(handle: $handle) {
                ...ProductWithCustomMetafields
            }
        }
        ${productWithCustomMetafieldsFragment}
    `;
    const data = await storefrontApi<{ product: ShopifyProduct | null }>(query, { handle });
    return data.product;
};