import React from 'react';
import { FONT_FACES } from '../constants';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from './icons';

interface TextControlsProps {
    onAddText: () => void;
    onFontChange: (font: string) => void;
    onTextAlign: (align: 'left' | 'center' | 'right') => void;
    activeObject: any;
}

const TextControls: React.FC<TextControlsProps> = ({ onAddText, onFontChange, onTextAlign, activeObject }) => {
    const isTextSelected = activeObject?.isType('textbox');

    return (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-300">Text</h3>
            <button onClick={onAddText} className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded text-sm font-semibold mb-2">
                Add Text
            </button>
            
            {isTextSelected && (
                <>
                    <div className="mt-2">
                        <label htmlFor="font-select" className="text-xs text-gray-400">Font Family</label>
                        <select 
                            id="font-select"
                            onChange={(e) => onFontChange(e.target.value)} 
                            value={activeObject.fontFamily || 'Lato'}
                            className="w-full bg-gray-700 p-2 rounded text-sm mt-1"
                        >
                            {FONT_FACES.map(f => <option key={f.family} value={f.family}>{f.name}</option>)}
                        </select>
                    </div>
                    <div className="mt-2">
                         <label className="text-xs text-gray-400">Alignment</label>
                         <div className="flex items-center space-x-2 mt-1">
                            <button onClick={() => onTextAlign('left')} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><AlignLeftIcon className="w-5 h-5" /></button>
                            <button onClick={() => onTextAlign('center')} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><AlignCenterIcon className="w-5 h-5" /></button>
                            <button onClick={() => onTextAlign('right')} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><AlignRightIcon className="w-5 h-5" /></button>
                         </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TextControls;