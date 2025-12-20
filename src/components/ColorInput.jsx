import React, { useState, useEffect } from 'react';
import { parseInputLines } from '../utils/colorUtils';
import { AlertCircle, Check } from 'lucide-react';

export default function ColorInput({ onColorsChanged }) {
    const [text, setText] = useState('');
    const [errorLines, setErrorLines] = useState([]);

    useEffect(() => {
        // Debounce processing
        const timer = setTimeout(() => {
            const { validColors, errors } = parseInputLines(text);
            setErrorLines(errors);
            onColorsChanged(validColors);
        }, 300);

        return () => clearTimeout(timer);
    }, [text, onColorsChanged]);

    return (
        <div className="clay-element bg-white p-6 w-full">
            <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-bold text-gray-800">
                    Input Colors
                </label>
                {text.length > 0 && (
                    <button
                        onClick={() => setText('')}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold underline decoration-2 decoration-red-200 hover:decoration-red-500 transition-all"
                    >
                        Clear Input
                    </button>
                )}
            </div>
            <div className="mb-2 text-xs text-gray-400 font-mono text-right">
                HEX, RGB, or HSL (One per line)
            </div>

            <div className="relative">
                <textarea
                    className="w-full h-32 p-4 rounded-xl border-2 border-transparent bg-gray-50 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none font-mono text-sm shadow-inner"
                    placeholder={`#FF5733\nrgb(100, 200, 50)\nhsl(200, 80%, 60%)`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    spellCheck={false}
                />

                {/* Validation Status Indicator */}
                <div className="absolute top-4 right-4">
                    {errorLines.length > 0 ? (
                        <div className="flex items-center gap-1 text-red-500 animate-pulse">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-bold">{errorLines.length} Invalid</span>
                        </div>
                    ) : text.trim().length > 0 ? (
                        <Check className="w-5 h-5 text-green-500" />
                    ) : null}
                </div>
            </div>

            {/* Error Details */}
            {errorLines.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 max-h-24 overflow-y-auto">
                    <p className="text-xs font-bold text-red-600 mb-1">Could not parse:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        {errorLines.map((err, idx) => (
                            <li key={idx} className="text-xs text-red-500 font-mono">
                                Line {err.line}: "{err.content}"
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
