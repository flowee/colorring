import { useEffect, useRef } from "react";

export default function AbstractOilBrushArt({
    colors = ["#1e3a8a", "#9333ea", "#f59e0b", "#dc2626"],
    width = 900,
    height = 600,
    mode = "brush", // "brush" | "knife" | "dry"
    lightAngle = -Math.PI / 4,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        drawGradientBackground(ctx, width, height, colors);
        applyCanvasGrain(ctx, width, height);

        const strokes =
            mode === "knife" ? 80 :
                mode === "dry" ? 160 : 140;

        for (let i = 0; i < strokes; i++) {
            paintStroke(ctx, {
                x: Math.random() * width,
                y: Math.random() * height,
                length: rand(140, 300),
                angle: rand(0, Math.PI * 2),
                color: colors[Math.floor(Math.random() * colors.length)],
                lightAngle,
                mode,
            });
        }

        applyCanvasGrain(ctx, width, height, 0.03);
    }, [colors, width, height, mode, lightAngle]);

    return <canvas ref={canvasRef} width={width} height={height} />;
}

/* =========================
   Background & Canvas
   ========================= */

function drawGradientBackground(ctx, w, h, colors) {
    const bg1 = colors[colors.length - 1] || "#f8fafc";
    const bg2 = colors[colors.length - 2] || "#eef2f7";

    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, bg1);
    g.addColorStop(1, bg2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Add subtle color washes (priming)
    for (let i = 0; i < 6; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = Math.random() * w * 0.8;
        const color = colors[Math.floor(Math.random() * colors.length)];

        const washGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
        washGrad.addColorStop(0, color + '45'); // Very faint
        washGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = washGrad;
        ctx.fillRect(0, 0, w, h);
    }
}

function applyCanvasGrain(ctx, w, h, strength = 0.05) {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * 255 * strength;
        d[i] += n;
        d[i + 1] += n;
        d[i + 2] += n;
    }

    ctx.putImageData(img, 0, 0);
}

/* =========================
   Paint Stroke Engine
   ========================= */

function paintStroke(ctx, {
    x, y, length, angle, color, lightAngle, mode
}) {
    const blocks =
        mode === "knife" ? randInt(2, 5) :
            mode === "dry" ? randInt(18, 28) :
                randInt(14, 22);

    const maxWidth =
        mode === "knife" ? rand(45, 80) :
            mode === "dry" ? rand(12, 22) :
                rand(18, 36);

    // ✅ OPAQUE paint (no transparency stacking)
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < blocks; i++) {
        const t = i / (blocks - 1);
        const taper = Math.sin(Math.PI * t);

        const blockWidth = maxWidth * taper;
        const blockLength =
            mode === "knife"
                ? length * rand(0.7, 1)
                : length / blocks * rand(0.8, 1.2);

        const px = x + Math.cos(angle) * length * t;
        const py = y + Math.sin(angle) * length * t;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle + Math.PI / 2);

        // 🖌️ Dry-brush skipping logic
        if (mode === "dry" && Math.random() < 0.35) {
            ctx.restore();
            continue; // skip → exposed canvas
        }

        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.roundRect(
            -blockLength / 2,
            -blockWidth / 2,
            blockLength,
            blockWidth,
            mode === "knife" ? blockWidth * 0.1 : blockWidth * 0.4
        );
        ctx.fill();

        // 🧽 Broken bristle texture (dry brush)
        if (mode === "dry") {
            ctx.fillStyle = "rgba(0,0,0,0.12)";
            ctx.globalAlpha = 1;
            for (let j = 0; j < 3; j++) {
                ctx.fillRect(
                    -blockLength / 2,
                    rand(-blockWidth / 2, blockWidth / 2),
                    blockLength,
                    rand(1, 2)
                );
            }
        }

        ctx.restore();
    }

    drawHighlight(ctx, {
        x, y, length, angle, maxWidth, lightAngle
    });
}

/* =========================
   Impasto Highlight
   ========================= */

function drawHighlight(ctx, {
    x, y, length, angle, maxWidth, lightAngle
}) {
    const normal = angle + Math.PI / 2;
    const hit = Math.cos(normal - lightAngle);

    if (hit < 0.25) return;

    ctx.save();
    ctx.strokeStyle = "white";
    ctx.globalAlpha = hit * 0.35;
    ctx.lineWidth = maxWidth * 0.1;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(
        x + Math.cos(normal) * maxWidth * 0.1,
        y + Math.sin(normal) * maxWidth * 0.1
    );
    ctx.lineTo(
        x + Math.cos(angle) * length * 0.7,
        y + Math.sin(angle) * length * 0.7
    );
    ctx.stroke();

    ctx.restore();
}

/* =========================
   Utils
   ========================= */

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(rand(min, max));
}
