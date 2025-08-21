import React from 'react';
import type { PriceDetails } from '../types';

interface PricingBreakdownProps {
    priceDetails: PriceDetails;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({ priceDetails }) => {
    const maxChars = 50; // As defined in constants.ts
    const charCountColor = priceDetails.characterCount > maxChars ? 'text-red-500 font-bold' : 'text-gray-300';

    return (
        <div>
            <h2 className="text-xl font-playfair border-b border-gray-700 pb-2 mb-4">Price Breakdown</h2>
            <div className="space-y-2 text-lg">
                <div className="flex justify-between"><span>Base Price:</span> <span>${priceDetails.base.toFixed(2)}</span></div>
                {priceDetails.text > 0 && (
                    <div className="flex justify-between">
                        <span>Text Engraving <span className={charCountColor}>({priceDetails.characterCount} Chars):</span></span> 
                        <span>${priceDetails.text.toFixed(2)}</span>
                    </div>
                )}
                {priceDetails.images > 0 && (
                    <div className="flex justify-between"><span>Image Engraving:</span> <span>${priceDetails.images.toFixed(2)}</span></div>
                )}
                <hr className="border-gray-600 my-2" />
                <div className="flex justify-between font-bold text-2xl"><span className="font-playfair">Total:</span> <span className="text-indigo-400">${priceDetails.total.toFixed(2)}</span></div>
            </div>
        </div>
    );
};

export default PricingBreakdown;