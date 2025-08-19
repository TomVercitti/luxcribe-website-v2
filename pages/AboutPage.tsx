import React, { useState, useEffect } from 'react';
import { fetchShopInfo } from '../services/shopify';
import type { ShopifyShop } from '../services/shopify';
import { Spinner } from '../components/icons';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '../config';

const teamMembers = [
  {
    name: 'Jane Doe',
    title: 'Founder & Lead Engraver',
    bio: 'With a decade of experience in craftsmanship and a passion for technology, Jane founded Luxcribe to bring personalized art to everyone.',
    imageUrl: 'https://storage.googleapis.com/gemini-ui-params/3b67f678-f7b5-4b40-8b1e-42c26f041d8e.png', // Placeholder
  },
  {
    name: 'John Smith',
    title: 'AI & Software Architect',
    bio: 'John is the visionary behind our AI-powered design tools, constantly pushing the boundaries of what\'s possible in digital creation.',
    imageUrl: 'https://storage.googleapis.com/gemini-ui-params/e232b847-a727-4a4b-9e45-13f83737b833.png', // Placeholder
  },
];

const values = [
  {
    title: 'Unmatched Quality',
    description: 'We source only the finest materials and use state-of-the-art laser technology to ensure every piece is a masterpiece.'
  },
  {
    title: 'Limitless Creativity',
    description: 'Our AI tools empower you to create truly unique designs, turning your imagination into a tangible keepsake.'
  },
  {
    title: 'Customer Dedication',
    description: 'Your satisfaction is our priority. From design to delivery, we are dedicated to providing a seamless experience.'
  }
];

const ShopifyConnectionStatus: React.FC = () => {
  const [shopInfo, setShopInfo] = useState<ShopifyShop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getShopInfo = async () => {
      setIsLoading(true);
      setError(null);
      
      // Pre-flight check for placeholder values in config
      if (SHOPIFY_STORE_DOMAIN.includes('YOUR_STORE_NAME') || SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes('YOUR_STOREFRONT_API_ACCESS_TOKEN')) {
        setError("Configuration needed: Your Shopify store details are missing. Please update the `config.ts` file with your store's domain and access token.");
        setIsLoading(false);
        return;
      }

      try {
        const info = await fetchShopInfo();
        if (info && info.name) {
          setShopInfo(info);
        } else {
          // This case can happen with a valid token that has zero permissions.
          setError("Could not retrieve shop information. The connection was successful but no data was returned. This often indicates your access token is missing the required 'unauthenticated_read_content' permission.");
        }
      } catch (e: any) {
        setError(e.message || "An unknown error occurred while connecting to Shopify.");
      } finally {
        setIsLoading(false);
      }
    };
    getShopInfo();
  }, []);

  const maskedToken = `${SHOPIFY_STOREFRONT_ACCESS_TOKEN.substring(0, 4)}...${SHOPIFY_STOREFRONT_ACCESS_TOKEN.substring(SHOPIFY_STOREFRONT_ACCESS_TOKEN.length - 4)}`;

  return (
    <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="font-playfair text-xl text-indigo-400">Shopify Connection Status</h3>
      {isLoading && (
        <div className="flex items-center mt-2">
          <Spinner className="w-6 h-6 mr-3" />
          <p className="text-gray-300">Attempting to connect to your store...</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
          <p className="font-bold text-lg text-red-200">
            {error.startsWith('Configuration needed') ? 'Action Required' : 'Connection Failed'}
          </p>
          <p className="mt-2 text-gray-300 font-mono bg-gray-800 p-2 rounded text-sm">{error}</p>

          <div className="mt-4 text-gray-300 space-y-6">
              <h4 className="text-lg font-bold text-white">Troubleshooting Guide</h4>
              
              {/* Step 1: Verify Config */}
              <div>
                  <p className="font-bold">Step 1: Verify your credentials in <code className="text-sm bg-gray-700 p-1 rounded">config.ts</code></p>
                  <p className="mt-2">Check for any typos or missing characters. These values must exactly match your Shopify details.</p>
                  <div className="mt-2 space-y-1 text-sm bg-gray-800 p-3 rounded-md">
                      <p><strong>Store Domain:</strong> <code className="text-yellow-300">{SHOPIFY_STORE_DOMAIN}</code></p>
                      <p><strong>Access Token:</strong> <code className="text-yellow-300">{maskedToken}</code></p>
                  </div>
              </div>

              {/* Step 2: Check Permissions */}
              <div>
                  <p className="font-bold">Step 2: Check your Storefront API permissions</p>
                  <p className="mt-2">This is the most common cause of errors. Your access token must have the correct permissions (called "scopes") to function.</p>
                  <ol className="list-decimal list-inside mt-2 space-y-2">
                      <li>In your Shopify Admin, go to: <br/> <strong className="text-white">Apps and sales channels &rarr; Develop apps &rarr; (Your App Name)</strong>.</li>
                      <li>Click on the <strong className="text-white">API credentials</strong> tab.</li>
                      <li>Scroll down to <strong className="text-white">Storefront API access scopes</strong> and ensure AT LEAST the following are checked:
                          <ul className="list-disc list-inside mt-2 ml-4 p-3 bg-gray-800 rounded-md text-yellow-300 font-mono text-sm space-y-1">
                              <li>unauthenticated_read_product_listings</li>
                              <li>unauthenticated_read_checkouts</li>
                              <li>unauthenticated_write_checkouts</li>
                              <li>unauthenticated_read_content</li>
                          </ul>
                      </li>
                      <li>If you made changes, be sure to click <strong className="text-white">"Save"</strong>.</li>
                  </ol>
              </div>

               {/* Step 3: Final Checks */}
              <div>
                  <p className="font-bold">Step 3: Final Checks</p>
                   <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Ensure your Store Domain is the <code className="text-sm bg-gray-700 p-1 rounded">.myshopify.com</code> URL, not a custom domain.</li>
                      <li>If issues persist, try creating a new private app and a new Storefront Access Token in Shopify to rule out a corrupted token.</li>
                   </ul>
              </div>

          </div>
        </div>
      )}
      {shopInfo && (
         <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300">
          <p className="font-bold text-lg text-green-200">Connection Successful!</p>
          <p className="mt-2">Successfully connected to Shopify store: <span className="font-semibold text-white">{shopInfo.name}</span></p>
        </div>
      )}
    </div>
  );
};


const AboutPage: React.FC = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section 
        className="relative py-24 md:py-32 text-white text-center bg-cover bg-center" 
        style={{backgroundImage: "url('https://storage.googleapis.com/gemini-ui-params/7f9411e7-f138-4e31-8633-5d518f813a37.png')"}}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold">About Luxcribe</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Blending timeless craftsmanship with cutting-edge technology to create personalized treasures.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-invert lg:prose-xl max-w-none">
              <h2 className="font-playfair">Our Story</h2>
              <p>
                Luxcribe was born from a simple idea: that the most meaningful gifts are the ones that tell a personal story. We saw a world of mass-produced items and envisioned something different—a place where anyone could become a creator, using the power of AI to design beautiful, bespoke pieces.
              </p>
              <p>
                Our journey began in a small workshop, fueled by a passion for laser engraving and a fascination with artificial intelligence. We combined these two worlds to build an intuitive platform that makes custom design accessible to all. Today, we are proud to help thousands of customers bring their unique visions to life, crafting heirlooms that will be cherished for generations.
              </p>

              {/* Shopify Connection Test Box */}
              <ShopifyConnectionStatus />

            </div>
            <div>
              <img 
                src="https://storage.googleapis.com/gemini-ui-params/aa4f63c8-5014-4171-a477-8c38686d1a10.png" 
                alt="Craftsmanship" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-playfair mb-12">What We Stand For</h2>
              <div className="grid md:grid-cols-3 gap-10">
                  {values.map((value, index) => (
                      <div key={index} className="p-6 bg-gray-800 rounded-lg">
                          <h3 className="text-2xl font-playfair mb-3 text-indigo-400">{value.title}</h3>
                          <p className="text-gray-400">{value.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-40 h-40 rounded-full object-cover mb-4 shadow-lg"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-indigo-400 font-medium">{member.title}</p>
                <p className="mt-2 text-gray-400 max-w-xs">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;