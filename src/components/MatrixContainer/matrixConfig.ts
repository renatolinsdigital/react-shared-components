/**
 * Matrix rain effect: configuration
 *
 * All visual parameters for the falling-glyph animation. A `config` prop on
 * <MatrixContainer> overrides any of them, and changes to it apply live.
 */
export interface MatrixConfig {
  /** Glyph pool; one is picked at random for every cell drawn */
  chars: string[];
  /** Font size in px, which is also the width and height of a grid cell */
  fontSize: number;
  /**
   * Probability (0 to 1) that a column is active and has a falling stream.
   * 0.25 means one column in four. Lower reads sparser, airier.
   */
  columnDensity: number;
  /**
   * Milliseconds between each one-row advancement. Higher means a slower
   * fall: at 60 ms and 14 px rows, a stream crosses 800 px in about 3.4 s.
   */
  tickMs: number;
  /** Number of rows in the fading tail behind the head glyph */
  trailLength: number;
  /** Opacity of the leading (brightest) glyph, 0 to 1 */
  headOpacity: number;
  /** Maximum opacity of the glyph immediately behind the head */
  trailOpacityMax: number;
  /** RGB triple of the glyph colour, used as rgba(r,g,b,opacity) */
  color: string;
}

export const MATRIX_CONFIG: MatrixConfig = {
  // Full-width katakana only: the 46 base gojuon glyphs, no digits
  chars: Array.from(
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  ),
  fontSize: 14,
  columnDensity: 1,
  tickMs: 60,
  trailLength: 10,
  headOpacity: 0.2,
  trailOpacityMax: 0.1,
  // The dark accent ($color-accent = #c8ff00, about 200,255,0) softened toward green
  color: '210,255,120',
};

/**
 * Overrides per theme, for a caller that knows the active one to pass as
 * `config`. The defaults above are drawn for a dark background. On a light one
 * the lime glyphs vanish, and dark glyphs at the same opacity read much fainter
 * than light ones on black, so light mode uses a deeper green, drawn stronger.
 */
export const MATRIX_THEME_CONFIG: Record<'dark' | 'light', Partial<MatrixConfig>> = {
  dark: {},
  light: { color: '56,142,0', headOpacity: 0.42, trailOpacityMax: 0.24 },
};
