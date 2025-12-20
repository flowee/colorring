import React, { useState, useRef } from 'react';
import Layout from './components/Layout';
import ColorInput from './components/ColorInput';
import Donut from './components/Donut';
import ThemePanel from './components/ThemePanel';
import { Sparkles, ArrowDown, Menu, X, Trash2, Copy } from 'lucide-react';
import { formatHSL, hslToHex } from './utils/colorUtils';

export default function App() {
    const [inputColors, setInputColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [showTheme, setShowTheme] = useState(false);
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [density, setDensity] = useState(15); // Default 5 degrees
    const [limitMessage, setLimitMessage] = useState(null);
    const themeRef = useRef(null);

    // Determine which donuts to show
    // If no input, show 1 default donut (Blue-ish)
    // If input, show first 3
    const donutsToShow = inputColors.length > 0
        ? inputColors.slice(0, 3)
        : [{ h: 240, s: 100, l: 50, original: 'default' }];

    const handleColorSelect = (color) => {
        // Check if already selected
        const exists = selectedColors.some(c =>
            c.h === color.h && c.s === color.s && c.l === color.l
        );

        if (exists) {
            // Deselect
            setSelectedColors(selectedColors.filter(c =>
                !(c.h === color.h && c.s === color.s && c.l === color.l)
            ));
            setLimitMessage(null); // Clear message on deselect
        } else {
            // Select (max 5)
            if (selectedColors.length < 5) {
                setSelectedColors([...selectedColors, color]);
                setLimitMessage(null);
            } else {
                // Show limit message
                setLimitMessage("You can only select up to 5 colors.");
                setTimeout(() => setLimitMessage(null), 1500);
            }
        }
    };

    const handleRemoveColor = (index) => {
        const newColors = [...selectedColors];
        newColors.splice(index, 1);
        setSelectedColors(newColors);
        if (newColors.length === 0) setShowTheme(false);
    };

    const handleGenerateTheme = () => {
        setShowTheme(true);
        setTimeout(() => {
            themeRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <Layout>
            <div className="relative min-h-screen">

                {/* Main Content Area */}
                <div className="pt-8 pb-8 w-full max-w-7xl mx-auto px-6">

                    {/* Donut Visualization Area */}
                    <div className="clay-element bg-white/50 p-12 min-h-[500px] flex flex-col items-center relative rounded-[3rem]">

                        {/* Density Dropdown (Only visible when no input colors) */}
                        {/* {inputColors.length === 0 && ( */}
                        <div className="absolute top-8 left-6 z-20 flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500">Density:</span>
                            <select
                                value={density}
                                onChange={(e) => setDensity(Number(e.target.value))}
                                className="bg-white border-none py-1.5 px-3 rounded-lg text-sm font-bold text-gray-700 shadow-sm outline-none cursor-pointer hover:bg-gray-50"
                            >
                                <option value={5}>5° (Detailed)</option>
                                <option value={15}>15° (Medium)</option>
                                <option value={30}>30° (Simple)</option>
                            </select>
                        </div>
                        {/* )} */}

                        {/* Input Toggle (Top Left) */}
                        <div className="absolute top-20 left-6 z-50 pointer-events-none">
                            <button
                                onClick={() => setIsInputOpen(!isInputOpen)}
                                className="bg-white p-3 rounded-full shadow-xl hover:bg-gray-50 transition-all text-gray-600 hover:text-indigo-600 border border-gray-100 pointer-events-auto"
                            >
                                {isInputOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            {/* Collapsible Input Panel */}
                            <div className={`mt-4 w-80 transition-all duration-300 transform origin-top-left ${isInputOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
                                <ColorInput onColorsChanged={setInputColors} />
                            </div>
                        </div>

                        <div className={`flex flex-wrap justify-center mt-8 gap-2 w-full z-10 ${inputColors.length > 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''}`}>
                            {(() => {
                                // Default View: No Input Colors, Single Donut
                                if (inputColors.length === 0) {
                                    return (
                                        <div className="col-span-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                            <Donut
                                                variant="default"
                                                baseSat={100}
                                                baseLight={50}
                                                step={density}
                                                selectedColors={selectedColors}
                                                onSelectColor={handleColorSelect}
                                            />
                                        </div>
                                    );
                                }

                                // Grouped View: Input Colors, Multiple Donuts
                                const groups = {};
                                inputColors.forEach(c => {
                                    const key = `${c.s}-${c.l}`;
                                    if (!groups[key]) {
                                        groups[key] = { s: c.s, l: c.l, colors: [] };
                                    }
                                    groups[key].colors.push(c);
                                });

                                return Object.values(groups).map((group, idx) => (
                                    <div key={`${group.s}-${group.l}`} className="flex flex-col items-center animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <Donut
                                            variant="compact"
                                            baseSat={group.s}
                                            baseLight={group.l}
                                            step={density}
                                            selectedColors={selectedColors}
                                            onSelectColor={handleColorSelect}
                                        />
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Selection & Theme Panel Section (Bottom) */}
                    <div className={`mt-12 transition-all duration-500 ${selectedColors.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
                        <div className="clay-element bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-6 rounded-3xl relative overflow-hidden">

                            <div className="relative z-10 flex flex-col items-center justify-between gap-8">

                                {/* Selected Colors Row */}
                                <div className="flex flex-wrap justify-center gap-4 items-end">
                                    {selectedColors.map((color, index) => {
                                        const hex = hslToHex(color);
                                        return (
                                            <div key={index} className="group relative flex flex-col items-center">
                                                <div
                                                    className="w-20 h-12 rounded-lg shadow-md border-2 border-white transition-transform hover:scale-105 mb-1"
                                                    style={{ backgroundColor: formatHSL(color) }}
                                                />
                                                <span className="text-xs font-mono  text-gray-600 uppercase">{formatHSL(color)}</span>
                                                <span className="text-xs font-mono  text-gray-600 uppercase">{hex}</span>
                                                <button
                                                    onClick={() => handleRemoveColor(index)}
                                                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {selectedColors.length > 0 && (
                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                onClick={() => {
                                                    const hexList = selectedColors.map(c => hslToHex(c)).join(', ');
                                                    navigator.clipboard.writeText(hexList);
                                                    setLimitMessage("Colors copied to clipboard!");
                                                    setTimeout(() => setLimitMessage(null), 1500);
                                                }}
                                                className="text-xs flex items-center gap-1 text-gray-500 hover:text-indigo-600 font-semibold transition-colors bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100"
                                            >
                                                <Copy className="w-3 h-3" />
                                                Copy All
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedColors([]);
                                                    setShowTheme(false);
                                                }}
                                                className="text-xs text-red-400 hover:text-red-600 font-semibold underline decoration-red-100 hover:decoration-red-300 transition-all text-center"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}

                                    {selectedColors.length === 0 && (
                                        <span className="text-gray-400 text-sm italic py-3">No colors selected</span>
                                    )}
                                </div>

                                <div className="w-full h-px bg-purple-100/50" />

                                {/* Action Area */}
                                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">Theme Generator</h3>
                                            <p className="text-gray-500 text-sm">
                                                Turn your selection into a cohesive design system.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateTheme}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2 group whitespace-nowrap"
                                    >
                                        Generate Theme
                                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showTheme && (
                        <div ref={themeRef} className="pt-12 pb-4">
                            <ThemePanel selectedColors={selectedColors} />
                        </div>
                    )}

                    {/* Limit Warning Toast */}
                    {limitMessage && (
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2">
                                <X className="w-4 h-4" />
                                {limitMessage}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout >
    );
}
