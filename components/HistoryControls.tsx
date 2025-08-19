import React from 'react';
import { UndoIcon, RedoIcon } from './icons';

interface HistoryControlsProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({ onUndo, onRedo, canUndo, canRedo }) => {
    
    const buttonClasses = `p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed w-full flex items-center justify-center`;

    return (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-indigo-300">History</h3>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={onUndo} disabled={!canUndo} className={buttonClasses} title="Undo">
                    <UndoIcon className="w-5 h-5" />
                </button>
                <button onClick={onRedo} disabled={!canRedo} className={buttonClasses} title="Redo">
                    <RedoIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default HistoryControls;