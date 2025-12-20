import React, { useRef, useEffect } from "react";

// --- hex → linear RGB ---
function hexToLinearRGB(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;

    // sRGB → linear
    const toLinear = v =>
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

    return [toLinear(r), toLinear(g), toLinear(b)];
}

export default function SpectralMixStatic({
    colors = ["#1e3a8a", "#9333ea", "#f59e0b", "#dc2626"],
    width = 900,
    height = 600,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl");
        if (!gl) return;

        canvas.width = width;
        canvas.height = height;

        // ------------------------
        // Vertex shader
        // ------------------------
        const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        // ------------------------
        // Fragment shader
        // ------------------------
        const fsSource = `
      precision highp float;

      uniform vec3 uYellow;
      uniform vec3 uRed;
      uniform vec3 uBlue;

      vec3 spectral_mix(
        vec3 c1, float w1, float t1,
        vec3 c2, float w2, float t2,
        vec3 c3, float w3, float t3
      ) {
        float sum = max(0.0001, w1*t1 + w2*t2 + w3*t3);
        return (
          c1 * w1 * t1 +
          c2 * w2 * t2 +
          c3 * w3 * t3
        ) / sum;
      }

      void main() {
        vec2 p = gl_FragCoord.xy / vec2(${width}.0, ${height}.0);

        vec3 col = spectral_mix(
          uYellow, 1.0, 1.0 - p.x,
          uRed,    0.5, p.x - p.y,
          uBlue,   1.0, p.y
        );

        gl_FragColor = vec4(col, 1.0);
      }
    `;

        // ------------------------
        // Compile helpers
        // ------------------------
        const compile = (type, source) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, source);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
            }
            return s;
        };

        const program = gl.createProgram();
        gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
        gl.linkProgram(program);
        gl.useProgram(program);

        // ------------------------
        // Fullscreen quad
        // ------------------------
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        const posLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // ------------------------
        // Pass theme colors as uniforms
        // ------------------------
        const yellow = hexToLinearRGB(colors[0]);
        const red = hexToLinearRGB(colors[1]);
        const blue = hexToLinearRGB(colors[2]);

        gl.uniform3fv(gl.getUniformLocation(program, "uYellow"), yellow);
        gl.uniform3fv(gl.getUniformLocation(program, "uRed"), red);
        gl.uniform3fv(gl.getUniformLocation(program, "uBlue"), blue);

        // ------------------------
        // Render once (static)
        // ------------------------
        gl.viewport(0, 0, width, height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }, [colors, width, height]);

    return <canvas ref={canvasRef} width={width} height={height} />;
}
