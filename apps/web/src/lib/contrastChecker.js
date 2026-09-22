/**
 * Calculates luminance and WCAG contrast ratio between two hex colors.
 * Used for QR Code scanning reliability checks.
 */

function hexToRgb(hex) {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance({ r, g, b }) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(fgHex, bgHex) {
  const rgb1 = hexToRgb(fgHex);
  const rgb2 = hexToRgb(bgHex);
  if (!rgb1 || !rgb2) return { ratio: 21, score: 'good', label: 'Optimal' };

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);

  if (ratio >= 4.5) {
    return { ratio: Number(ratio.toFixed(1)), score: 'good', label: 'High Contrast (Optimal)' };
  } else if (ratio >= 2.5) {
    return { ratio: Number(ratio.toFixed(1)), score: 'fair', label: 'Fair Contrast (May scan slower)' };
  } else {
    return { ratio: Number(ratio.toFixed(1)), score: 'poor', label: 'Low Contrast (Scanning risk!)' };
  }
}
