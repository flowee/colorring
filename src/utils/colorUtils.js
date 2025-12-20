/**
 * Color Utility Functions
 * Handles parsing of HEX, RGB, and HSL strings into normalized HSL objects.
 */

// Regex patterns for different color formats
const HEX_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const HEX_SHORT_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const RGB_REGEX = /^rgba?\((\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d\.]+)?\s*)\)$/i;
const HSL_REGEX = /^hsla?\((\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?(?:\s*,\s*[\d\.]+)?\s*)\)$/i;
export const colorData = {
    0: "red", 5: "scarlet", 10: "vermilion", 15: "rose", 20: "raspberry",
    25: "cerise", 30: "orange", 35: "tangerine", 40: "carrot", 45: "amber",
    50: "goldenrod", 55: "sunflower", 60: "yellow", 65: "lemon",
    70: "chartreuse-yellow", 75: "chartreuse", 80: "yellow-green",
    85: "spring-bud", 90: "lime", 95: "lime-green", 100: "spring-green",
    105: "mint-green", 110: "mint", 115: "jade", 120: "green", 125: "emerald",
    130: "emerald-green", 135: "sea-green", 140: "ocean-green",
    145: "turquoise-green", 150: "turquoise", 155: "aquamarine", 160: "aqua",
    165: "teal", 170: "deep-teal", 175: "blue-teal", 180: "cyan",
    185: "electric-cyan", 190: "sky-cyan", 195: "sky", 200: "light-sky",
    205: "powder-blue", 210: "baby-blue", 215: "soft-blue", 220: "denim-light",
    225: "blue", 230: "royal-blue", 235: "azure", 240: "indigo",
    245: "indigo-blue", 250: "violet-blue", 255: "blue-violet",
    260: "periwinkle", 265: "violet-light", 270: "violet",
    275: "purple-violet", 280: "purple-light", 285: "orchid-light",
    290: "orchid", 295: "magenta-light", 300: "magenta", 305: "hot-magenta",
    310: "fuchsia", 315: "fuchsia-pink", 320: "hot-pink", 325: "carnation",
    330: "rose-fuchsia", 335: "rose-pink", 340: "raspberry-pink", 345: "pink",
    350: "light-pink", 355: "soft-pink"
};

export const labelPositions = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/**
 * clamp value between min and ma
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Converts formatted hex to RGB object
 */
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

/**
 * Converts RGB object to HSL object
 * r, g, b are in [0, 255]
 * Returns { h, s, l } where h in [0, 360], s, l in [0, 100]
 */
function rgbToHsl({ r, g, b }) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * Converts HSL object to RGB object
 */
export function hslToRgb({ h, s, l }) { // Exporting incase needed elsewhere
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * Parses any valid color string into an HSL object
 * Returns null if invalid
 */
export function parseColorToHSL(input) {
    const cleanInput = input.trim().toLowerCase();

    // 1. Try HEX
    if (HEX_REGEX.test(cleanInput) || HEX_SHORT_REGEX.test(cleanInput)) {
        // Validate hex chars
        if (!/^#?[0-9a-f]{3,6}$/i.test(cleanInput)) return null;
        try {
            const rgb = hexToRgb(cleanInput);
            return { ...rgbToHsl(rgb), original: input };
        } catch (e) { return null; }
    }

    // 2. Try RGB
    const rgbMatch = cleanInput.match(RGB_REGEX);
    if (rgbMatch) {
        const values = rgbMatch[1].split(',').map(v => parseFloat(v.trim()));
        if (values.length < 3) return null;
        const [r, g, b] = values;
        return { ...rgbToHsl({ r, g, b }), original: input };
    }

    // 3. Try HSL
    const hslMatch = cleanInput.match(HSL_REGEX);
    if (hslMatch) {
        const values = hslMatch[1].split(',').map(v => v.trim());
        if (values.length < 3) return null;

        let h = parseFloat(values[0]);
        let s = parseFloat(values[1].replace('%', ''));
        let l = parseFloat(values[2].replace('%', ''));

        // Normalize
        h = h % 360;
        if (h < 0) h += 360;
        s = clamp(s, 0, 100);
        l = clamp(l, 0, 100);

        return { h: Math.round(h), s: Math.round(s), l: Math.round(l), original: input };
    }

    return null;
}

/**
 * Formats HSL object to CSS string
 */
export function formatHSL({ h, s, l }) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Converts HSL to Hex
 */
export function hslToHex({ h, s, l }) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Parses raw multi-line input into an array of valid HSL colors
 */
export function parseInputLines(text) {
    if (!text) return { validColors: [], errors: [] };

    // Split by newlines, trim
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

    const validColors = [];
    const errors = [];

    lines.forEach((line, index) => {
        const result = parseColorToHSL(line);
        if (result) {
            validColors.push(result);
        } else {
            errors.push({ line: index + 1, content: line });
        }
    });

    return { validColors, errors };
}

/**
 * Returns 'dark' (for white text) or 'light' (for black text) based on brightness
 */
export function getContrastingTextColor({ h, s, l }) {
    const { r, g, b } = hslToRgb({ h, s, l });
    // YIQ equation
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? 'dark' : 'light';
}
