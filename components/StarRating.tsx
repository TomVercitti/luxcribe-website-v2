import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, className }) => {
  const totalStars = 5;

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <StarIcon 
            key={index} 
            className="w-5 h-5 text-yellow-400" 
            filled={starNumber <= rating}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
