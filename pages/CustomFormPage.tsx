import React from 'react';

const CustomFormPage: React.FC = () => {
  // Embed the Shopify contact form to handle custom quote requests directly.
  // This provides a seamless, working solution without complex external configuration.
  const shopifyContactUrl = 'https://dbrd1n-q5.myshopify.com/contact';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Custom & Bulk Orders</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
          Have a unique project, a large corporate order, or a complex design in mind? We'd love to help bring your vision to life. Use the form below to provide details about your project, and our team will get back to you with a custom quote.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <iframe
          src={shopifyContactUrl}
          title="Custom & Bulk Order Quote Form"
          className="w-full h-[800px] border-0 rounded-lg shadow-2xl bg-white"
          loading="lazy"
        >
          Loading quote form...
        </iframe>
      </div>
    </div>
  );
};

export default CustomFormPage;