import React from 'react';
import { FONT_FACES } from '../constants';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from './icons';

interface TextControlsProps {
    onAddText: () => void;
    onFontChange: (font: string) => void;
    onTextAlign: (align: 'left' | 'center' | 'right') => void;
    onFontSizeChange: (size: number) => void;
    onToggleTextStyle: (style: 'bold' | 'italic' | 'underline') => void;
    activeObject: any;
}

const TextControls: React.FC<TextControlsProps> = ({ 
    onAddText, onFontChange, onTextAlign, 
    onFontSizeChange, onToggleTextStyle, activeObject 
}) => {
    const isTextSelected = activeObject?.isType('textbox');
    
    // Helper for style buttons
    const StyleButton: React.FC<{
        style: 'bold' | 'italic' | 'underline';
        children: React.ReactNode;
    }> = ({ style, children }) => {
        let isActive = false;
        if (isTextSelected) {
            switch (style) {
                case 'bold': isActive = activeObject.fontWeight === 'bold'; break;
                case 'italic': isActive = activeObject.fontStyle === 'italic'; break;
                case 'underline': isActive = activeObject.underline; break;
            }
        }
        return (
            <button
                onClick={() => onToggleTextStyle(style)}
                className={`p-2 rounded hover:bg-gray-600 ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-300">Text</h3>
            <button onClick={onAddText} className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded text-sm font-semibold mb-2">
                Add Text
            </button>
            
            {isTextSelected && (
                <div className="space-y-3 mt-2">
                    {/* Font Family */}
                    <div>
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

                    {/* Font Size & Style */}
                    <div className="grid grid-cols-2 gap-2 items-end">
                        <div>
                            <label htmlFor="font-size" className="text-xs text-gray-400">Font Size</label>
                            <input 
                                id="font-size"
                                type="number"
                                value={Math.round(activeObject.fontSize)}
                                onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
                                className="w-full bg-gray-700 p-2 rounded text-sm mt-1 font-size-input"
                            />
                        </div>
                        <div className="flex items-center space-x-1">
                            <StyleButton style="bold"><BoldIcon className="w-5 h-5" /></StyleButton>
                            <StyleButton style="italic"><ItalicIcon className="w-5 h-5" /></StyleButton>
                            <StyleButton style="underline"><UnderlineIcon className="w-5 h-5" /></StyleButton>
                        </div>
                    </div>
                    
                    {/* Alignment */}
                    <div>
                         <label className="text-xs text-gray-400">Alignment</label>
                         <div className="flex items-center space-x-2 mt-1">
                            <button onClick={() => onTextAlign('left')} className={`p-2 rounded hover:bg-gray-600 ${activeObject.textAlign === 'left' ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}><AlignLeftIcon className="w-5 h-5" /></button>
                            <button onClick={() => onTextAlign('center')} className={`p-2 rounded hover:bg-gray-600 ${activeObject.textAlign === 'center' ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}><AlignCenterIcon className="w-5 h-5" /></button>
                            <button onClick={() => onTextAlign('right')} className={`p-2 rounded hover:bg-gray-600 ${activeObject.textAlign === 'right' ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}><AlignRightIcon className="w-5 h-5" /></button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextControls;