import React from 'react';
import { CurveTextIcon } from './icons';

interface TextEffectsControlsProps {
    onCurveChange: (curve: number) => void;
    onRotateChange: (angle: number) => void;
    activeObject: any;
}

const TextEffectsControls: React.FC<TextEffectsControlsProps> = ({ onCurveChange, onRotateChange, activeObject }) => {
    const isTextSelected = activeObject?.isType('textbox');
    const isObjectSelected = !!activeObject;

    const currentCurve = activeObject?.data?.curve || 0;
    const currentAngle = Math.round(activeObject?.angle || 0);

    if (!isObjectSelected) {
        return null;
    }

    return (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-300 flex items-center">
                <CurveTextIcon className="w-5 h-5 mr-2" />
                Effects
            </h3>
            
            {isTextSelected && (
                 <div className="mt-2">
                    <label htmlFor="curve-slider" className="text-xs text-gray-400">Curve ({currentCurve})</label>
                    <input
                        id="curve-slider"
                        type="range"
                        min="-100"
                        max="100"
                        value={currentCurve}
                        onChange={(e) => onCurveChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1"
                    />
                </div>
            )}
            
            <div className="mt-2">
                <label htmlFor="rotate-slider" className="text-xs text-gray-400">Rotate ({currentAngle}°)</label>
                 <input
                    id="rotate-slider"
                    type="range"
                    min="-180"
                    max="180"
                    value={currentAngle}
                    onChange={(e) => onRotateChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-1"
                />
            </div>

        </div>
    );
};

export default TextEffectsControls;