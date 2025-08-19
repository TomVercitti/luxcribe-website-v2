import React from 'react';
import { TrashIcon } from './icons';

interface LayersPanelProps {
    layers: any[];
    onSelectLayer: (layer: any) => void;
    onDeleteLayer: (layer: any) => void;
    activeObject: any;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ layers, onSelectLayer, onDeleteLayer, activeObject }) => {
    
    const getLayerName = (layer: any) => {
        if (layer.isType('textbox')) {
            const text = layer.text || '';
            return `Text: "${text.substring(0, 15)}${text.length > 15 ? '...' : ''}"`;
        }
        if (layer.isType('image')) {
            return 'Image';
        }
        if (layer.isType('group')) {
            return 'Design';
        }
        return 'Object';
    }

    if (layers.length === 0) {
        return null; // Don't show the panel if there are no layers
    }

    return (
        <div className="mt-4">
            <h3 className="font-semibold mb-2">Layers</h3>
            <ul className="space-y-2 bg-gray-900 rounded-lg p-2 max-h-48 overflow-y-auto">
                {layers.map((layer, index) => (
                    <li key={layer.uuid || index} className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${activeObject === layer ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        <button onClick={() => onSelectLayer(layer)} className="flex-grow text-left text-sm truncate">
                            {getLayerName(layer)}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer); }} className="ml-2 text-gray-400 hover:text-red-500">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LayersPanel;
