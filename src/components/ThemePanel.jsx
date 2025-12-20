import React, { useState, useEffect } from 'react';
import { generateTheme } from '../utils/themeUtils';
import DashboardMockup from './DashboardMockup';
import ArtMockup from './ArtMockup';
import SpectralArtMockup from './SpectralArtMockup';
import { Download } from 'lucide-react';

export default function ThemePanel({ selectedColors }) {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        if (selectedColors.length > 0) {
            setTheme(generateTheme(selectedColors));
        } else {
            setTheme(null);
        }
    }, [selectedColors]);

    const handleExport = () => {
        if (!theme) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(theme, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `theme-${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (!theme) return null;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
            {/* Divider */}
            <div className="w-full h-px bg-gray-200" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Theme Info Stick */}
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Generated Theme</h2>
                    <p className="text-gray-500 text-sm">Based on your selection, we've created a harmonious design system.</p>

                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(theme.colors).map(([role, data]) => (
                            <div key={role} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg shadow-inner ring-1 ring-black/5"
                                        style={{ backgroundColor: data.base }}
                                    />
                                    <div>
                                        <div className="capitalize font-bold text-gray-700 text-sm">{role}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">{data.hex}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleExport}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors mt-4"
                    >
                        <Download className="w-4 h-4" /> Export Theme
                    </button>
                </div>

                {/* Visual Mockups Grid: 2 Dashboard (Left) | 2 Art (Right) */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column: Dashboards */}
                    <div className="flex flex-col gap-6 h-[800px]">
                        <div className="flex-1 clay-element bg-white p-3 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-3 left-3 z-20 bg-black/50 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur-md font-bold">
                                Dashboard Layout A
                            </div>
                            <DashboardMockup theme={theme} variant="default" />
                        </div>
                        <div className="flex-1 clay-element bg-white p-3 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-3 left-3 z-20 bg-black/50 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur-md font-bold">
                                Dashboard Layout B
                            </div>
                            <DashboardMockup theme={theme} variant="alt" />
                        </div>
                    </div>

                    {/* Right Column: Arts */}
                    <div className="flex flex-col gap-6 h-[800px]">
                        <div className="flex-1 clay-element bg-white p-3 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-3 left-3 z-20 bg-black/50 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur-md font-bold">
                                Abstract Oil Painting
                            </div>
                            <ArtMockup theme={theme} />
                        </div>
                        <div className="flex-1 clay-element bg-white p-3 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-3 left-3 z-20 bg-black/50 text-[10px] text-white px-2 py-0.5 rounded backdrop-blur-md font-bold">
                                Spectral Mix Painting
                            </div>
                            <SpectralArtMockup theme={theme} />
                        </div>
                    </div>

                </div>
            </div>


            {/* Why this works? */}
            <div className="clay-element bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center text-center">
                <h3 className="font-bold text-gray-800 mb-2">Why this works?</h3>
                <p className="text-sm text-gray-600 max-w-lg">
                    This palette uses <strong>{theme.colors.primary.hex}</strong> as the visual anchor.
                    The High Saturation of the Accent color provides focus, while the detailed Lightness scale ensures accessible text ensuring a WCAG compliant experience.
                </p>
            </div>
        </div>
    );
}
