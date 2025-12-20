import React, { useMemo } from 'react';
import AbstractOilBrushArt from './AbstractOilBrushArt';

export default function ArtMockup({ theme }) {
    const { colors } = theme;

    // Colors to use for the painting
    const palette = useMemo(() => {
        return [
            colors.primary.hex,
            colors.secondary.hex,
            colors.accent.hex,
            colors.background.hex,
            colors.surface.hex,
        ];
    }, [colors]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl relative bg-black">
            <AbstractOilBrushArt
                colors={palette}
                width={800}
                height={800}
            />

            {/* Overlay Sheen */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-black/10 via-white/5 to-white/10 mix-blend-overlay" />

            <div className="absolute bottom-4 right-4 text-[10px] font-serif italic text-white/20 select-none">
                Spectral Oil No. {palette.length}
            </div>
        </div>
    );
}
