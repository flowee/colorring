import React from 'react';
import { Copy, X, Trash2 } from 'lucide-react';
import { formatHSL, hslToHex } from '../utils/colorUtils';

export default function SelectionPanel({ selectedColors, onRemoveColor, onClearAll }) {

    const handleCopy = () => {
        const text = selectedColors
            .map(c => `HSL: ${formatHSL(c)} | HEX: ${hslToHex(c)}`)
            .join('\n');
        navigator.clipboard.writeText(text);
        alert('Colors copied to clipboard!');
    };

    if (selectedColors.length === 0) {
        return (
            <div className="clay-element bg-gray-50 p-6 flex flex-col items-center justify-center text-gray-400 min-h-[160px]">
                <span className="text-sm font-medium">No colors selected</span>
                <span className="text-xs">Click segments on the donuts to select</span>
            </div>
        )
    }

    return (
        <div className="clay-element bg-white p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Selected Colors
                    <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs">
                        {selectedColors.length}/5
                    </span>
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={onClearAll}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Clear All"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors"
                    >
                        <Copy className="w-3 h-3" /> Copy All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {selectedColors.map((color, idx) => (
                    <div
                        key={idx}
                        className="group relative clay-element bg-white p-3 flex flex-col gap-2 items-center hover:scale-105 transition-transform"
                    >
                        <button
                            onClick={() => onRemoveColor(idx)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        <div
                            className="w-full h-12 rounded-lg shadow-inner"
                            style={{ backgroundColor: formatHSL(color) }}
                        />

                        <div className="text-center space-y-0.5">
                            <div className="text-xs font-bold text-gray-700 font-mono">
                                {hslToHex(color)}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                                {formatHSL(color)}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Fill empty slots with ghosts if needed, or just leave flex */}
            </div>
        </div>
    );
}
