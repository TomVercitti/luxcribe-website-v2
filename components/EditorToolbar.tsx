import React, { useState, useRef, useEffect } from 'react';
import { FONT_FACES, ENGRAVING_COLORS } from '../constants';
import { 
    UndoIcon, RedoIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, 
    BoldIcon, ItalicIcon, UnderlineIcon, ChevronDownIcon, TrashIcon
} from './icons';
import UploadGuideModal from './UploadGuideModal';

interface EditorToolbarProps {
    activeObject: any;
    onAddText: () => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddFromLibrary: (svg: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onModification: (props: { [key: string]: any }) => void;
    onToggleTextStyle: (style: 'bold' | 'italic' | 'underline') => void;
    onTextCurveChange: (curve: number) => void;
    onDeleteObject: (obj: any) => void;
    materialStyle: any;
}

const Separator: React.FC = () => <div className="h-10 w-px bg-gray-300 mx-2" />;

const ToolbarButton: React.FC<{ 
    onClick?: () => void; 
    disabled?: boolean; 
    children: React.ReactNode; 
    isActive?: boolean; 
    title: string 
}> = ({ onClick, disabled, children, isActive, title }) => (
    <button
        title={title}
        onClick={onClick}
        disabled={disabled}
        className={`
            flex items-center justify-center 
            w-12 h-12 rounded-md 
            text-base
            transition-colors
            hover:bg-gray-200 
            disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent 
            ${isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'text-gray-800'}
        `}
    >
        {children}
    </button>
);

const FontSelector: React.FC<{ value: string; onChange: (font: string) => void; }> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    return (
        <div className="relative" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between w-52 h-12 px-3 border border-gray-300 rounded-md bg-white text-gray-800 text-base font-medium"
            >
                <span className="truncate">{FONT_FACES.find(f => f.family === value)?.name || value}</span>
                <ChevronDownIcon className="w-6 h-6 flex-shrink-0 text-gray-600" />
            </button>
            {isOpen && (
                <div className="absolute z-20 top-full mt-1 w-60 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {FONT_FACES.map(font => (
                        <button
                            key={font.family}
                            onClick={() => { onChange(font.family); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-100 text-gray-800 text-base"
                            style={{ fontFamily: font.family }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const FontSizeInput: React.FC<{ value: number; onChange: (size: number) => void; }> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value, 10);
        if (!isNaN(newSize)) {
            onChange(newSize);
        }
    };

    const step = (amount: number) => onChange(Math.max(1, value + amount));

    return (
        <div className="flex items-center border border-gray-300 rounded-md h-12 bg-white">
            <button onClick={() => step(-1)} className="px-3 h-full hover:bg-gray-200 text-lg rounded-l-md transition-colors">-</button>
            <input 
                type="number"
                value={value}
                onChange={handleChange}
                className="w-16 h-full text-center p-1 border-l border-r border-gray-300 text-base bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button onClick={() => step(1)} className="px-3 h-full hover:bg-gray-200 text-lg rounded-r-md transition-colors">+</button>
        </div>
    );
};

const ColorPalette: React.FC<{ value: string; onChange: (color: string) => void; materialFill: string; }> = ({ value, onChange, materialFill }) => {
    // For simplicity, we can show a single color that represents the material.
    // A more complex implementation could offer shades appropriate for the material.
    const displayColor = { name: 'Material Color', hex: materialFill };
    
    return (
        <div className="flex items-center space-x-2" title={`Engraving Color for this Material: ${materialFill}`}>
            <div
                className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-white ring-indigo-500"
                style={{ backgroundColor: displayColor.hex }}
            />
            <span className="text-sm text-gray-600">Material-Based Color</span>
        </div>
    );
};

const TextToolbar: React.FC<EditorToolbarProps> = (props) => {
    const { activeObject, onModification, onToggleTextStyle, materialStyle } = props;
    if (!activeObject) return null;

    return (
        <>
            <FontSelector value={activeObject.fontFamily} onChange={(font) => onModification({ fontFamily: font })} />
            <FontSizeInput value={Math.round(activeObject.fontSize)} onChange={(size) => onModification({ fontSize: size })} />
            <Separator />
            <div className="flex items-center bg-gray-100 rounded-md">
                <ToolbarButton title="Bold" onClick={() => onToggleTextStyle('bold')} isActive={activeObject.fontWeight === 'bold'}><BoldIcon className="w-6 h-6"/></ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => onToggleTextStyle('italic')} isActive={activeObject.fontStyle === 'italic'}><ItalicIcon className="w-6 h-6"/></ToolbarButton>
                <ToolbarButton title="Underline" onClick={() => onToggleTextStyle('underline')} isActive={activeObject.underline}><UnderlineIcon className="w-6 h-6"/></ToolbarButton>
            </div>
            <Separator />
            <div className="flex items-center bg-gray-100 rounded-md">
                <ToolbarButton title="Align Left" onClick={() => onModification({ textAlign: 'left' })} isActive={activeObject.textAlign === 'left'}><AlignLeftIcon className="w-6 h-6"/></ToolbarButton>
                <ToolbarButton title="Align Center" onClick={() => onModification({ textAlign: 'center' })} isActive={activeObject.textAlign === 'center'}><AlignCenterIcon className="w-6 h-6"/></ToolbarButton>
                <ToolbarButton title="Align Right" onClick={() => onModification({ textAlign: 'right' })} isActive={activeObject.textAlign === 'right'}><AlignRightIcon className="w-6 h-6"/></ToolbarButton>
            </div>
            <Separator />
            <ColorPalette value={activeObject.fill} onChange={(color) => onModification({ fill: color })} materialFill={materialStyle.fill} />
        </>
    )
}


const EditorToolbar: React.FC<EditorToolbarProps> = (props) => {
    const { activeObject, onAddText, onFileUpload, onUndo, onRedo, canUndo, canRedo, onDeleteObject } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    const isText = activeObject?.isType('textbox');
    
    const handleProceedToUpload = () => {
        setIsGuideModalOpen(false);
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="bg-white text-gray-800 shadow-md p-2 flex items-center space-x-2 flex-wrap">
                <ToolbarButton title="Undo" onClick={onUndo} disabled={!canUndo}>
                    <UndoIcon className="w-6 h-6" />
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={onRedo} disabled={!canRedo}>
                    <RedoIcon className="w-6 h-6" />
                </ToolbarButton>
                <Separator />

                {isText && <TextToolbar {...props} />}

                {activeObject && (
                    <>
                    <Separator />
                    <ToolbarButton title="Delete" onClick={() => onDeleteObject(activeObject)}>
                        <TrashIcon className="w-6 h-6 text-red-600" />
                    </ToolbarButton>
                    </>
                )}

                {!activeObject && (
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={onAddText} 
                            className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 font-medium text-base h-12 transition-colors"
                        >
                            Add Text
                        </button>
                        <button 
                            onClick={() => setIsGuideModalOpen(true)}
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium text-base h-12 transition-colors"
                        >
                            Upload Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept=".png,.svg" />
                    </div>
                )}
            </div>
            <UploadGuideModal 
                isOpen={isGuideModalOpen} 
                onClose={() => setIsGuideModalOpen(false)} 
                onProceed={handleProceedToUpload} 
            />
        </>
    );
};

export default EditorToolbar;
