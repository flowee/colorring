import { formatHSL, hslToHex } from './colorUtils';

/**
 * Basic WCAG contrast check (simplified)
 * Returns 'black' or 'white' based on which is better for the background color.
 */
function getContrastColor(h, s, l) {
    // Convert HSL to approximate relative luminance
    // This is a rough heuristic. 
    // L > 50 usually needs dark text, L < 50 needs light text.
    // We can refine this.
    return l > 60 ? '#1f2937' : '#ffffff'; // Tailwind gray-800 or white
}

/**
 * Returns a variant of a color
 */
function getVariant(h, s, l, lMod = 0, sMod = 0) {
    let newL = Math.max(0, Math.min(100, l + lMod));
    let newS = Math.max(0, Math.min(100, s + sMod));
    return { h, s: newS, l: newL };
}

/**
 * Generates a theme object based on input colors
 */
export function generateTheme(colors) {
    // Default fallback if no colors
    if (!colors || colors.length === 0) {
        colors = [{ h: 240, s: 100, l: 50 }]; // Default Blue
    }

    // Sort by luminance for logical assignment
    const sortedByL = [...colors].sort((a, b) => b.l - a.l); // Lightest first
    const sortedByS = [...colors].sort((a, b) => b.s - a.s); // Most vibrant first

    let primary, secondary, accent, background, surface, text;

    // Heuristic Logic
    if (colors.length === 1) {
        // Monochromatic
        const base = colors[0];
        primary = base;
        secondary = getVariant(base.h, base.s, base.l, 20); // Lighter
        accent = getVariant(base.h, Math.min(100, base.s + 20), base.l, -10); // More saturated, slightly darker
        background = getVariant(base.h, 20, 96); // Very light tint
        surface = '#ffffff';
        text = getVariant(base.h, 30, 15); // Very dark shade
    } else if (colors.length === 2) {
        // Use both
        primary = colors[0];
        secondary = colors[1];
        accent = getVariant(colors[0].h, 100, 60); // Vibrant variant of primary
        background = getVariant(colors[1].h, 10, 97); // Tint of secondary
        surface = '#ffffff';
        text = '#111827';
    } else {
        // Assign roles
        // Primary: The first selected color (user intent usually first)
        primary = colors[0];

        // Secondary: The second color
        secondary = colors[1];

        // Accent: The most vibrant color that isn't primary or secondary? 
        // Or just the third color.
        accent = colors[2] || getVariant(primary.h, 100, 60);

        // Background: If we have a very light color (L > 90), use it.
        const lightColor = sortedByL.find(c => c.l > 85);
        background = lightColor || getVariant(primary.h, 10, 97);

        surface = '#ffffff';

        // Text: If we have a very dark color (L < 20), use it.
        const darkColor = [...sortedByL].reverse().find(c => c.l < 25);
        text = darkColor || '#1f2937';
    }

    // Ensure text contrast on backgrounds
    // If background is dark... (not handling dark mode yet, assuming light mode output for now)

    return {
        name: "Generated Theme",
        colors: {
            primary: {
                base: formatHSL(primary),
                hex: hslToHex(primary),
                text: getContrastColor(primary.h, primary.s, primary.l)
            },
            secondary: {
                base: formatHSL(secondary),
                hex: hslToHex(secondary),
                text: getContrastColor(secondary.h, secondary.s, secondary.l)
            },
            accent: {
                base: formatHSL(accent),
                hex: hslToHex(accent),
                text: getContrastColor(accent.h, accent.s, accent.l)
            },
            background: {
                base: typeof background === 'string' ? background : formatHSL(background),
                hex: typeof background === 'string' ? background : hslToHex(background)
            },
            surface: {
                base: typeof surface === 'string' ? surface : formatHSL(surface),
                hex: typeof surface === 'string' ? surface : hslToHex(surface)
            },
            text: {
                base: typeof text === 'string' ? text : formatHSL(text),
                hex: typeof text === 'string' ? text : hslToHex(text)
            }
        }
    };
}
