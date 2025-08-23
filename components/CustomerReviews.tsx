import React from 'react';
import { customerReviews } from '../constants';
import StarRating from './StarRating';

const CustomerReviews: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {customerReviews.map((item, index) => (
        <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
          <StarRating rating={item.rating} />
          <blockquote className="text-gray-300 italic mt-4 flex-grow">
            "{item.reviewText}"
          </blockquote>
          <div className="mt-4 text-right">
            <p className="font-semibold text-indigo-400">- {item.customerName}</p>
            <p className="text-sm text-gray-500">on {item.productName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerReviews;
