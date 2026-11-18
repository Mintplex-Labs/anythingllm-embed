const DARK_TEXT = "#020617";
const LIGHT_TEXT = "#FFFFFF";

/**
 * Picks whichever of dark or light text stays readable on a hex background.
 * @param {string} hex - #rgb or #rrggbb
 * @returns {string}
 */
export function contrastTextColor(hex = "") {
  const value = String(hex).trim().replace("#", "");
  const full = value.length === 3 ? value.replace(/./g, "$&$&") : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) return DARK_TEXT;

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? DARK_TEXT : LIGHT_TEXT;
}
