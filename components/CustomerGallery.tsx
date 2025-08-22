import React from 'react';
import { customerGalleryItems } from '../constants';

const CustomerGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {customerGalleryItems.map((item, index) => (
        <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden group transition-all transform hover:-translate-y-1 hover:shadow-indigo-500/20">
          <img 
            src={item.imageUrl} 
            alt={`Engraved ${item.productName} by ${item.customerName}`} 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="p-6">
            <blockquote className="text-gray-300 italic border-l-4 border-indigo-500 pl-4">
              {item.reviewText}
            </blockquote>
            <p className="mt-4 font-semibold text-right text-indigo-400">- {item.customerName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerGallery;
