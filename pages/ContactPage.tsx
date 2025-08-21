import React from 'react';
import { MailIcon, PhoneIcon } from '../components/icons';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Get In Touch</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Have a question or a custom project in mind? We'd love to hear from you! Reach out via email or give us a call.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <a
          href="mailto:contact@example.com"
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-xl shadow-lg"
        >
          <MailIcon className="w-6 h-6" />
          Email Us
        </a>
        <a
          href="tel:+15551234567"
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors text-xl shadow-lg"
        >
          <PhoneIcon className="w-6 h-6" />
          Call Us
        </a>
      </div>
    </div>
  );
};

export default ContactPage;