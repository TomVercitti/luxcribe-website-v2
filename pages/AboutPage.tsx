import React from 'react';
import { useState } from 'react';
import { fetchShopInfo } from '../services/shopify';
import type { ShopifyShop } from '../types';
import { Spinner } from '../components/icons';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '../config';

const teamMembers = [
  {
    name: 'Swapnil Poudyal',
    title: 'Founder & Lead Engraver',
    bio: 'With a decade of experience in craftsmanship and a passion for technology, Swapnil founded Luxcribe to bring personalized art to everyone.',
    imageUrl: 'https://raw.githubusercontent.com/TomVercitti/luxcribe-website/main/Swapnil%20Poudyal.jfif',
  },
  {
    name: 'Google AI Studio',
    title: 'AI & Software Architect',
    bio: 'Google AI Studio is the visionary technology behind our AI-powered design tools, constantly pushing the boundaries of what\'s possible in digital creation.',
    imageUrl: 'https://raw.githubusercontent.com/TomVercitti/luxcribe-website/main/google-background.png',
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

const ShopifyConnectionManager: React.FC = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [shopInfo, setShopInfo] = useState<ShopifyShop | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Local state for the input fields, initialized from config.ts
  const [localDomain, setLocalDomain] = useState(SHOPIFY_STORE_DOMAIN);
  const [localToken, setLocalToken] = useState(SHOPIFY_STOREFRONT_ACCESS_TOKEN);

  const handleTestConnection = async () => {
    setTestStatus('loading');
    setError(null);
    setShopInfo(null);

    try {
      const info = await fetchShopInfo(localDomain, localToken);
      if (info && info.name) {
        setShopInfo(info);
        setTestStatus('success');
      } else {
        setError("Connection was successful, but no shop data was returned. This may indicate an issue with your access token's permissions.");
        setTestStatus('error');
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred while connecting to Shopify.");
      setTestStatus('error');
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="font-playfair text-xl text-indigo-400">Shopify Connection Manager</h3>
      <p className="mt-2 text-sm text-gray-400">
        This tool helps you verify your local development connection to Shopify. Your live site on Netlify uses environment variables instead.
      </p>

      {/* Interactive Inputs */}
      <div className="mt-4 space-y-3 bg-gray-800 p-4 rounded-lg">
        <div>
          <label htmlFor="shopDomain" className="text-xs font-bold text-gray-400">Shopify Store Domain</label>
          <input
            id="shopDomain"
            type="text"
            value={localDomain}
            onChange={(e) => setLocalDomain(e.target.value)}
            placeholder="your-store-name.myshopify.com"
            className="font-mono text-lg text-white bg-gray-700 p-2 rounded mt-1 break-all w-full border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="accessToken" className="text-xs font-bold text-gray-400">Storefront Access Token</label>
          <input
            id="accessToken"
            type="password"
            value={localToken}
            onChange={(e) => setLocalToken(e.target.value)}
            placeholder="your-storefront-access-token"
            className="font-mono text-lg text-white bg-gray-700 p-2 rounded mt-1 break-all w-full border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleTestConnection}
        disabled={testStatus === 'loading'}
        className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-gray-600"
      >
        {testStatus === 'loading' ? <Spinner className="w-6 h-6" /> : 'Test Connection'}
      </button>

      {/* Status Display */}
      <div className="mt-4 min-h-[80px]">
        {testStatus === 'success' && shopInfo && (
           <div className="p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300">
            <p className="font-bold text-lg text-green-200">Connection Successful!</p>
            <p className="mt-2">Successfully connected to Shopify store: <span className="font-semibold text-white">{shopInfo.name}</span></p>
          </div>
        )}
        {testStatus === 'error' && error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
            <p className="font-bold text-lg text-red-200">Connection Failed</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Troubleshooting Guide */}
      <div className="mt-6 text-gray-300 space-y-6">
          <h4 className="text-lg font-bold text-white">Troubleshooting Guide</h4>
          
          <div>
              <p className="font-bold">Step 1: Test Your Credentials</p>
              <p className="mt-2">
                Enter your Shopify Store Domain and Storefront Access Token into the fields above and click the "Test Connection" button.
              </p>
          </div>

           <div>
              <p className="font-bold">Step 2: Make It Permanent (for Local Development)</p>
              <p className="mt-2">
                Once the test is successful, open the <code className="bg-gray-700 p-1 rounded text-xs">config.ts</code> file in your project and replace the placeholder values with the credentials you just tested. This will save them for your next session.
              </p>
          </div>
          
          <div>
              <p className="font-bold">Step 3: Check API Permissions</p>
              <p className="mt-2">If the test fails, the problem is likely your access token permissions.</p>
              <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>In Shopify Admin, go to: <br/> <strong className="text-white">Apps and sales channels &rarr; Develop apps &rarr; (Your App Name)</strong>.</li>
                  <li>Go to the <strong className="text-white">API credentials</strong> tab.</li>
                  <li>Under <strong className="text-white">Storefront API access scopes</strong>, ensure at least these are checked:
                      <ul className="list-disc list-inside mt-2 ml-4 p-3 bg-gray-800 rounded-md text-yellow-300 font-mono text-sm space-y-1">
                          <li>unauthenticated_read_product_listings</li>
                          <li>unauthenticated_read_checkouts</li>
                          <li>unauthenticated_write_checkouts</li>
                          <li>unauthenticated_read_content</li>
                      </ul>
                  </li>
                  <li>Click <strong className="text-white">Save</strong>.</li>
              </ol>
          </div>
      </div>
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
              <ShopifyConnectionManager />

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
          <h2 className="text-3xl md:text-4xl font-playfair mb-12">Our Foundation</h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Founder */}
            <div className="flex flex-col items-center lg:w-96">
                <img 
                    src={teamMembers[0].imageUrl} 
                    alt={teamMembers[0].name} 
                    className="w-40 h-40 rounded-full object-cover mb-4 shadow-lg"
                />
                <h3 className="text-xl font-semibold">{teamMembers[0].name}</h3>
                <p className="text-indigo-400 font-medium">{teamMembers[0].title}</p>
                <p className="mt-2 text-gray-400 max-w-xs">{teamMembers[0].bio}</p>
            </div>

            {/* Plus Icon */}
            <div className="hidden lg:block text-6xl font-thin text-indigo-400 mx-4 transform -translate-y-8">
                +
            </div>

            {/* AI Architect */}
            <div className="flex flex-col items-center lg:w-96">
                <img 
                    src={teamMembers[1].imageUrl} 
                    alt={teamMembers[1].name} 
                    className="w-40 h-40 rounded-full object-cover mb-4 shadow-lg"
                />
                <h3 className="text-xl font-semibold">{teamMembers[1].name}</h3>
                <p className="text-indigo-400 font-medium">{teamMembers[1].title}</p>
                <p className="mt-2 text-gray-400 max-w-xs">{teamMembers[1].bio}</p>
            </div>
            
            {/* Equals Icon */}
            <div className="hidden lg:block text-6xl font-thin text-indigo-400 mx-4 transform -translate-y-8">
                =
            </div>
            
            {/* Luxcribe Logo Result */}
            <div className="hidden lg:flex flex-col items-center justify-center lg:w-96">
                <img 
                    src="https://raw.githubusercontent.com/TomVercitti/luxcribe-website/main/64_White%20Black%20Modern%20Initial%20Logo-Transparent.png" 
                    alt="Luxcribe Logo" 
                    className="w-40 h-40 object-contain filter drop-shadow-lg"
                />
                <h3 className="text-2xl font-semibold font-playfair mt-2">Luxcribe</h3>
                <p className="text-indigo-400 font-medium">Your Vision, Crafted</p>
                <p className="mt-2 text-gray-400 max-w-xs">The result of human creativity powered by artificial intelligence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;