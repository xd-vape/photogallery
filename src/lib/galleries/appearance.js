export const COVER_STYLE_OPTIONS = [
  { id: "CLASSIC", label: "Classic", description: "Title centered over image" },
  { id: "MINIMAL", label: "Minimal", description: "Small title, clean look" },
  { id: "BOLD", label: "Bold", description: "Large uppercase title" },
  { id: "SPLIT", label: "Split", description: "Title beside the image" },
  { id: "DARK", label: "Dark", description: "Dark overlay, light text" },
];

export const FONT_STYLE_OPTIONS = [
  {
    id: "SERIF",
    label: "Serif",
    description: "A classic, elegant font",
    preview: "Aa",
    className: "font-serif",
  },
  {
    id: "SANS",
    label: "Sans",
    description: "A clean, neutral font",
    preview: "Aa",
    className: "font-sans font-light",
  },
  {
    id: "MODERN",
    label: "Modern",
    description: "Sophisticated and refined",
    preview: "Aa",
    className: "font-sans font-light tracking-widest",
  },
  {
    id: "TIMELESS",
    label: "Timeless",
    description: "Light and airy",
    preview: "Aa",
    className: "font-serif font-light italic",
  },
];

export const COLOR_PALETTE_OPTIONS = [
  { id: "LIGHT", label: "Light", swatches: ["#f9f7f4", "#e8e4df", "#1a1714"] },
  { id: "GOLD", label: "Gold", swatches: ["#faf6ee", "#d4a853", "#2a2218"] },
  { id: "ROSE", label: "Rose", swatches: ["#fdf0f0", "#c97878", "#2a1818"] },
  { id: "SAND", label: "Sand", swatches: ["#f7f3ed", "#b8976a", "#241e18"] },
  { id: "OLIVE", label: "Olive", swatches: ["#f4f5ee", "#8a9456", "#1c1e14"] },
  { id: "DARK", label: "Dark", swatches: ["#1a1a1a", "#2d2d2d", "#f0ede8"] },
];

export const GRID_COLUMN_OPTIONS = [
  { id: 2, label: "2 columns" },
  { id: 3, label: "3 columns" },
  { id: 4, label: "4 columns" },
];

export const GRID_SPACING_OPTIONS = [
  { id: "TIGHT", label: "Tight", gap: "1px" },
  { id: "REGULAR", label: "Regular", gap: "4px" },
  { id: "LARGE", label: "Large", gap: "12px" },
];

export const GALLERY_APPEARANCE_DEFAULTS = {
  coverStyle: "CLASSIC",
  fontStyle: "SERIF",
  colorPalette: "LIGHT",
  gridColumns: 3,
  gridSpacing: "REGULAR",
};

export const GALLERY_PALETTES = {
  LIGHT: {
    background: "#f9f7f4",
    surface: "#e8e4df",
    foreground: "#1a1714",
    muted: "#6f6861",
    accent: "#1a1714",
    accentForeground: "#ffffff",
  },
  GOLD: {
    background: "#faf6ee",
    surface: "#efe2c9",
    foreground: "#2a2218",
    muted: "#75654e",
    accent: "#b8872f",
    accentForeground: "#ffffff",
  },
  ROSE: {
    background: "#fdf0f0",
    surface: "#f0d8d8",
    foreground: "#2a1818",
    muted: "#7b5b5b",
    accent: "#a95454",
    accentForeground: "#ffffff",
  },
  SAND: {
    background: "#f7f3ed",
    surface: "#e8ded0",
    foreground: "#241e18",
    muted: "#71665a",
    accent: "#8f7049",
    accentForeground: "#ffffff",
  },
  OLIVE: {
    background: "#f4f5ee",
    surface: "#e1e4cf",
    foreground: "#1c1e14",
    muted: "#656a4e",
    accent: "#707a3e",
    accentForeground: "#ffffff",
  },
  DARK: {
    background: "#1a1a1a",
    surface: "#2d2d2d",
    foreground: "#f0ede8",
    muted: "#aaa49d",
    accent: "#f0ede8",
    accentForeground: "#1a1a1a",
  },
};

const validCoverStyles = new Set(COVER_STYLE_OPTIONS.map((option) => option.id));
const validFontStyles = new Set(FONT_STYLE_OPTIONS.map((option) => option.id));
const validColorPalettes = new Set(COLOR_PALETTE_OPTIONS.map((option) => option.id));
const validGridColumns = new Set(GRID_COLUMN_OPTIONS.map((option) => option.id));
const validGridSpacings = new Set(GRID_SPACING_OPTIONS.map((option) => option.id));

export function normalizeGalleryAppearance(value = {}) {
  const gridColumns = Number(value.gridColumns);

  return {
    coverStyle: validCoverStyles.has(value.coverStyle)
      ? value.coverStyle
      : GALLERY_APPEARANCE_DEFAULTS.coverStyle,
    fontStyle: validFontStyles.has(value.fontStyle)
      ? value.fontStyle
      : GALLERY_APPEARANCE_DEFAULTS.fontStyle,
    colorPalette: validColorPalettes.has(value.colorPalette)
      ? value.colorPalette
      : GALLERY_APPEARANCE_DEFAULTS.colorPalette,
    gridColumns: validGridColumns.has(gridColumns)
      ? gridColumns
      : GALLERY_APPEARANCE_DEFAULTS.gridColumns,
    gridSpacing: validGridSpacings.has(value.gridSpacing)
      ? value.gridSpacing
      : GALLERY_APPEARANCE_DEFAULTS.gridSpacing,
  };
}
