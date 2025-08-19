import React from 'react';
import { DESIGN_LIBRARY_ITEMS } from '../constants';

interface DesignLibraryProps {
    onSelect: (svgString: string) => void;
}

const DesignLibrary: React.FC<DesignLibraryProps> = ({ onSelect }) => {
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2">Design Library</h3>
            <div className="grid grid-cols-4 gap-2">
                {DESIGN_LIBRARY_ITEMS.map(item => (
                    <button 
                        key={item.name} 
                        onClick={() => onSelect(item.svg)} 
                        className="bg-gray-700 p-2 rounded hover:bg-gray-600 aspect-square flex items-center justify-center" 
                        title={item.name}
                    >
                       <div className="w-full h-full text-white" dangerouslySetInnerHTML={{__html: item.svg}} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DesignLibrary;