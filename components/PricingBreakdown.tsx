import React from 'react';
import type { PriceDetails } from '../types';

interface PricingBreakdownProps {
    priceDetails: PriceDetails;
    onQuantityChange: (quantity: number) => void;
}

const PricingBreakdown: React.FC<PricingBreakdownProps> = ({ priceDetails, onQuantityChange }) => {
    const { 
        base, material, setup, vectorize, photo, engravingCost, extraAreaCost, 
        subtotal, discount, quantity, total 
    } = priceDetails;

    // Helper to render a row in the breakdown, but only if the value is greater than zero.
    const renderRow = (label: string, value: number, isHidden: boolean = false) => {
        if (isHidden || value === 0) return null;
        return (
            <div className="flex justify-between text-sm text-gray-300">
                <span>{label}:</span>
                <span>${value.toFixed(2)}</span>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-playfair border-b border-gray-700 pb-2 mb-4">Live Price Calculator</h2>
            
            <div className="space-y-1 mb-3">
                {renderRow('Base Price', base)}
                {renderRow('Material Cost', material)}
                {renderRow('Setup Fee', setup)}
                {renderRow('Vectorize Fee', vectorize)}
                {renderRow('Photo Fee', photo)}
                {renderRow('Engraving Cost', engravingCost)}
                {renderRow('Extra Area Cost', extraAreaCost)}
                <div className="flex justify-between font-semibold text-base text-white border-t border-gray-600 pt-1 mt-1">
                    <span>Price per Item:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center mb-3">
                 <div>
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-200">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => onQuantityChange(parseInt(e.target.value, 10) || 1)}
                        className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-200">Bulk Discount</div>
                    <div className="text-lg font-semibold text-green-400">
                        {((discount || 0) * 100).toFixed(0)}%
                    </div>
                </div>
            </div>
            
            <hr className="border-gray-600 my-2" />
            <div className="flex justify-between font-bold text-2xl">
                <span className="font-playfair">Total Price:</span>
                <span className="text-indigo-400">${total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default PricingBreakdown;