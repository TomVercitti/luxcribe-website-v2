import React, { useState } from 'react';

const CustomFormPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair">Bulk &amp; Custom Quotes</h1>
        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
          Have a large order, a corporate gift inquiry, or a completely unique idea? Fill out the form below, and we'll get back to you with a custom quote.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        <form
          action="https://formspree.io/f/xpwlvrro"
          method="POST"
          className="space-y-6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300">Company (Optional)</label>
                <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Project Description</label>
              <textarea name="description" id="description" rows={6} required value={formData.description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-3 text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please describe your project, including materials, dimensions, quantity, and any other relevant details."></textarea>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
                Send Quote Request
              </button>
            </div>
             <p className="text-xs text-gray-500 text-center">
              Your request will be sent to our team via Formspree.
            </p>
        </form>
      </div>
    </div>
  );
};

export default CustomFormPage;
