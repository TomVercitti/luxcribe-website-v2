import React from 'react';
import { BringToFrontIcon, SendToBackIcon } from './icons';

interface ArrangeControlsProps {
    onArrange: (direction: 'front' | 'back' | 'forward' | 'backward') => void;
    activeObject: any;
}

const ArrangeControls: React.FC<ArrangeControlsProps> = ({ onArrange, activeObject }) => {
    const isObjectSelected = !!activeObject;

    const buttonClasses = `p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed w-full flex items-center justify-center text-xs`;

    return (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-300">Arrange</h3>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onArrange('forward')} disabled={!isObjectSelected} className={buttonClasses}>
                    Bring Forward
                </button>
                <button onClick={() => onArrange('backward')} disabled={!isObjectSelected} className={buttonClasses}>
                    Send Backward
                </button>
                <button onClick={() => onArrange('front')} disabled={!isObjectSelected} className={buttonClasses}>
                    <BringToFrontIcon className="w-4 h-4 mr-1" /> To Front
                </button>
                 <button onClick={() => onArrange('back')} disabled={!isObjectSelected} className={buttonClasses}>
                    <SendToBackIcon className="w-4 h-4 mr-1" /> To Back
                </button>
            </div>
        </div>
    );
};

export default ArrangeControls;