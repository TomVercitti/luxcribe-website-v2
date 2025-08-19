import React from 'react';

const ContactPage: React.FC = () => {
  // Use the Shopify contact page URL from your store
  const shopifyContactUrl = 'https://dbrd1n-q5.myshopify.com/contact';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Get In Touch</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Have a question or a custom project in mind? We'd love to hear from you! Use the form below to send us a message.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <iframe
          src={shopifyContactUrl}
          title="Contact Us"
          className="w-full h-[800px] border-0 rounded-lg shadow-2xl bg-white"
          loading="lazy"
        >
          Loading contact form...
        </iframe>
      </div>
    </div>
  );
};

export default ContactPage;
