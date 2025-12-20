import React, { useMemo } from 'react';
import SpectralGradient from './SpectralGradient';
import SpectralMixStatic from './SpectralMixStatic';


export default function SpectralArtMockup({ theme }) {
    const { colors } = theme;

    const palette = useMemo(() => {
        return [
            colors.primary.hex,
            colors.secondary.hex,
            colors.accent.hex,
        ];
    }, [colors]);

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl relative bg-stone-900">
            <SpectralGradient
                colors={palette}
                width={800}
                height={800}
            />

            {/* Glaze / Varnish Effect */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/5 to-black/10 mix-blend-overlay" />

            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="px-2 py-1 bg-black/30 backdrop-blur-md rounded text-[9px] font-bold text-white/50 tracking-tighter uppercase">
                    Spectral Engine
                </div>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] font-serif italic text-white/20 select-none">
                Pigment Mix No. {palette.length}
            </div>
        </div>
    );
}
