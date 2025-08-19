import React from 'react';
import type { EngravingZone } from '../types';

interface ZoneSelectorProps {
    zones: EngravingZone[];
    activeZoneId: string;
    onSelectZone: (zoneId: string) => void;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({ zones, activeZoneId, onSelectZone }) => {
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2 text-indigo-300">Editing Zone</h3>
            <div className="flex flex-wrap gap-2">
                {zones.map(zone => (
                    <button
                        key={zone.id}
                        onClick={() => onSelectZone(zone.id)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                            activeZoneId === zone.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {zone.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ZoneSelector;
