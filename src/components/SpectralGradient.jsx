import React, { useEffect, useRef } from 'react';
import spectral from 'spectral.js';

export default function SpectralGradient({
    colors = ["#1e3a8a", "#9333ea", "#f59e0b", "#dc2626"],
    width = 900,
    height = 600,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Convert to spectral.Color once ---
        const spectralColors = colors.map(c => new spectral.Color(c));

        // --- Clear background ---
        ctx.fillStyle = colors[colors.length - 1];
        ctx.fillRect(0, 0, width, height);

        // --- Main diagonal spectral gradient ---
        for (let x = 0; x < width; x++) {
            const t = x / (width - 1);

            // Diagonal bias
            const diag = t * 0.5 + 0.5;

            // Build gradient stops
            const stops = spectralColors.map((c, i) => [
                c,
                i / (spectralColors.length - 1),
            ]);

            // Spectral gradient sampling
            const col = spectral.gradient(diag, ...stops).toString();

            // Vertical diffusion
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, withAlpha(col, 0.95));
            grad.addColorStop(1, withAlpha(col, 0.85));

            ctx.fillStyle = grad;
            ctx.fillRect(x, 0, 1, height);
        }

        // --- Oil diffusion wash ---
        ctx.globalCompositeOperation = 'multiply';
        for (let i = 0; i < 6; i++) {
            const cx = Math.random() * width;
            const cy = Math.random() * height;
            const r = 120 + Math.random() * 260;
            const col = colors[Math.floor(Math.random() * colors.length)];

            const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            wash.addColorStop(0, withAlpha(col, 0.05));
            wash.addColorStop(1, 'transparent');

            ctx.fillStyle = wash;
            ctx.fillRect(0, 0, width, height);
        }
        ctx.globalCompositeOperation = 'source-over';

        // --- Canvas grain ---
        const img = ctx.getImageData(0, 0, width, height);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
            const g = (Math.random() - 0.5) * 6;
            d[i] = clamp(d[i] + g);
            d[i + 1] = clamp(d[i + 1] + g);
            d[i + 2] = clamp(d[i + 2] + g);
        }
        ctx.putImageData(img, 0, 0);

    }, [colors, width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-auto rounded-xl"
        />
    );
}

// --- Helpers ---
function withAlpha(color, alpha) {
    return color.startsWith('#')
        ? color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        : color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
}

function clamp(v) {
    return Math.max(0, Math.min(255, v));
}
