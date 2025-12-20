import React, { useMemo, useState, useEffect } from 'react';
import { formatHSL, hslToHex, colorData, labelPositions, getContrastingTextColor } from '../utils/colorUtils';

const Donut = ({
    baseHue = 0,
    baseSat = 75,
    baseLight = 50,
    onSelectColor,
    selectedColors = [],
    variant = 'default',
    step: propStep // Optional prop to override step
}) => {

    // Hover state
    const [hoveredColor, setHoveredColor] = useState(null);

    // Internal state for sliders
    const [currentS, setCurrentS] = useState(baseSat);
    const [currentL, setCurrentL] = useState(baseLight);

    useEffect(() => {
        setCurrentS(baseSat);
    }, [baseSat]);

    useEffect(() => {
        setCurrentL(baseLight);
    }, [baseLight]);

    // Configuration based on variant
    const isCompact = variant === 'compact';

    // Reduced sizes based on user request / recent changes
    const size = isCompact ? 260 : 400;
    const center = size / 2;

    const innerRadius = isCompact ? 70 : 90;
    const outerRadius = isCompact ? 100 : 140;
    const labelRadius = isCompact ? 110 : 180;

    // For guide lines (default only)
    const guideStartRadius = outerRadius + 10;
    const guideEndRadius = labelRadius - 15;

    // Steps: Use prop if available, otherwise 72 for default (5deg), 12 for compact (30deg)
    // If propStep is provided, use it. Else fall back to defaults.
    const step = propStep || (isCompact ? 30 : 5);

    // Calculate segments
    const segments = useMemo(() => {
        const segs = [];

        for (let h = 0; h < 360; h += step) {
            // Geometry
            const startAngle = h;
            const endAngle = h + step;

            // Convert to radians (rotate -90 to start at top)
            const radStart = (startAngle - 90) * (Math.PI / 180);
            const radEnd = (endAngle - 90) * (Math.PI / 180);

            // SVG Path coords
            const x1 = center + innerRadius * Math.cos(radStart);
            const y1 = center + innerRadius * Math.sin(radStart);
            const x2 = center + outerRadius * Math.cos(radStart);
            const y2 = center + outerRadius * Math.sin(radStart);
            const x3 = center + outerRadius * Math.cos(radEnd);
            const y3 = center + outerRadius * Math.sin(radEnd);
            const x4 = center + innerRadius * Math.cos(radEnd);
            const y4 = center + innerRadius * Math.sin(radEnd);

            const d = `
                M ${x1} ${y1}
                L ${x2} ${y2}
                A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
                L ${x4} ${y4}
                A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
                Z
            `;

            // Selection Popout Geometry (Outer Arc)
            const popOutRadiusStart = outerRadius + 5;
            const popOutRadiusEnd = outerRadius + 15;
            const px1 = center + popOutRadiusStart * Math.cos(radStart);
            const py1 = center + popOutRadiusStart * Math.sin(radStart);
            const px2 = center + popOutRadiusEnd * Math.cos(radStart);
            const py2 = center + popOutRadiusEnd * Math.sin(radStart);
            const px3 = center + popOutRadiusEnd * Math.cos(radEnd);
            const py3 = center + popOutRadiusEnd * Math.sin(radEnd);
            const px4 = center + popOutRadiusStart * Math.cos(radEnd);
            const py4 = center + popOutRadiusStart * Math.sin(radEnd);

            const popOutD = `
                M ${px1} ${py1}
                L ${px2} ${py2}
                A ${popOutRadiusEnd} ${popOutRadiusEnd} 0 0 1 ${px3} ${py3}
                L ${px4} ${py4}
                A ${popOutRadiusStart} ${popOutRadiusStart} 0 0 0 ${px1} ${py1}
                Z
            `;


            // Color Data using CURRENT interactive S/L
            const color = { h, s: currentS, l: currentL };
            const colorStr = formatHSL(color);
            const hex = hslToHex(color);

            // Only show name if it exists in data
            const name = colorData[h] || '';

            // Check selection
            const isSelected = selectedColors.some(c =>
                c.h === h && c.s === currentS && c.l === currentL
            );

            segs.push({ d, popOutD, color, colorStr, name, isSelected });
        }
        return segs;
    }, [currentS, currentL, selectedColors, step, center, innerRadius, outerRadius]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className={`relative clay-element bg-white p-6 ${isCompact ? 'rounded-[30px]' : 'rounded-[40px]'} flex flex-col items-center`}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Center Display: Hover Color or Selected Text */}
                    {hoveredColor ? (
                        <g>
                            <circle cx={center} cy={center} r={innerRadius - 35} fill={formatHSL(hoveredColor)} />
                            <text
                                x={center}
                                y={center}
                                dy="-5"
                                textAnchor="middle"
                                className={`text-xs font-bold drop-shadow-sm pointer-events-none ${getContrastingTextColor(hoveredColor) === 'dark' ? 'fill-gray-900' : 'fill-white'}`}
                            >
                                {hoveredColor.h}°
                            </text>
                            <text
                                x={center}
                                y={center}
                                dy="12"
                                textAnchor="middle"
                                className={`text-[10px] font-medium drop-shadow-sm pointer-events-none uppercase tracking-wider opacity-90 ${getContrastingTextColor(hoveredColor) === 'dark' ? 'fill-gray-800' : 'fill-white'}`}
                            >
                                {colorData[hoveredColor.h] || 'Color'}
                            </text>
                        </g>
                    ) : (
                        <text x={center} y={center} textAnchor="middle" dy="0" className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold fill-gray-400 pointer-events-none`}>
                            {Math.round(360 / step)} Colors
                        </text>
                    )}

                    {/* Segments */}
                    {segments.map((seg, i) => (
                        <g key={i}>
                            {/* Main Segment */}
                            <path
                                d={seg.d}
                                fill={seg.colorStr}
                                stroke="white"
                                strokeWidth={0.5}
                                className="cursor-pointer hover:opacity-80 transition-all"
                                onClick={() => onSelectColor(seg.color)}
                                onMouseEnter={() => setHoveredColor(seg.color)}
                                onMouseLeave={() => setHoveredColor(null)}
                            >
                                <title>{`${seg.name} (Hue: ${seg.color.h})`}</title>
                            </path>

                            {/* Selection Popout */}
                            {seg.isSelected && (
                                <path
                                    d={seg.popOutD}
                                    fill={seg.colorStr}
                                    className="pointer-events-none animate-in fade-in zoom-in duration-300"
                                />
                            )}
                        </g>
                    ))}

                    {/* Labels & Guide Lines (Only for Default View) */}
                    {!isCompact && labelPositions.map(angle => {
                        const rad = (angle - 90) * (Math.PI / 180);

                        // Text Pos
                        const tx = center + labelRadius * Math.cos(rad);
                        const ty = center + labelRadius * Math.sin(rad);

                        // Line Pos
                        const lx1 = center + guideStartRadius * Math.cos(rad);
                        const ly1 = center + guideStartRadius * Math.sin(rad);
                        const lx2 = center + guideEndRadius * Math.cos(rad);
                        const ly2 = center + guideEndRadius * Math.sin(rad);

                        const name = colorData[angle];

                        return (
                            <g key={angle}>
                                {/* Guide Line */}
                                <line
                                    x1={lx1} y1={ly1}
                                    x2={lx2} y2={ly2}
                                    stroke="#E5E7EB"
                                    strokeWidth="2"
                                />
                                <text
                                    x={tx} y={ty}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-xs font-semibold fill-gray-500 pointer-events-none"
                                >
                                    {name}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Sliders Control Panel */}
                <div className={`mt-6 w-full ${isCompact ? 'max-w-[200px]' : 'max-w-[300px]'} space-y-3`}>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-500 w-8">S:{currentS}%</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentS}
                            onChange={(e) => setCurrentS(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-500 w-8">L:{currentL}%</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentL}
                            onChange={(e) => setCurrentL(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Donut;
