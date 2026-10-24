/**
 * Default configuration for the OrbitalDots canvas effect.
 *
 * All values can be partially overridden via the `config` prop on <OrbitalDots>.
 * Config is captured once at mount: remount the component to apply new values.
 */
export interface OrbitalDotsConfig {
  /** Number of floating dot nodes. More dots = denser network. */
  dotCount: number;
  /** Maximum pixel distance between two dots before a connector line is drawn. */
  maxLineDistance: number;
  /** Minimum radius (px) of a dot. */
  dotMinRadius: number;
  /** Maximum radius (px) of a dot. */
  dotMaxRadius: number;
  /**
   * Base velocity multiplier. Each dot's vx/vy is initialised as a random unit
   * vector scaled by this value. Higher = faster drift.
   */
  speed: number;
  /** Maximum opacity of a connector line (at zero distance). Falls off linearly to 0. */
  lineOpacity: number;
  /** Opacity range for dots: each dot gets a random value in [dotOpacityMin, 1]. */
  dotOpacityMin: number;
  /** Shadow glow spread in pixels applied to all dots. */
  glowBlur: number;
  /** Whether to draw the dashed orbit ring in the canvas centre. */
  showOrbitRing: boolean;
  /**
   * Radius of the orbit ring as a fraction of min(canvasWidth, canvasHeight).
   * e.g. 0.28 = 28% of the shortest edge.
   */
  orbitRingRadius: number;
  /** Whether to render floating code symbols around the canvas. */
  showSymbols: boolean;
  /** Array of symbol strings to scatter around the canvas. */
  symbols: string[];
  /**
   * Font size of the symbols, expressed as a fraction of min(width, height).
   * e.g. 0.035 = 3.5% of the shortest canvas dimension.
   */
  symbolFontScale: number;
  /**
   * Milliseconds between draw frames. Lower = smoother but heavier.
   * Matches MatrixContainer's `tickMs` convention.
   */
  tickMs: number;
  /**
   * Dot and line colour as an RGB triple string: `'R,G,B'`.
   * Matches the MatrixContainer `color` convention.
   */
  color: string;
}

export const ORBITAL_DOTS_CONFIG: OrbitalDotsConfig = {
  dotCount: 38,
  maxLineDistance: 110,
  dotMinRadius: 1.5,
  dotMaxRadius: 4.5,
  speed: 0.38,
  lineOpacity: 0.28,
  dotOpacityMin: 0.45,
  glowBlur: 10,
  showOrbitRing: true,
  orbitRingRadius: 0.27,
  showSymbols: true,
  symbols: ['{ }', '[ ]', '</ >', '( )'],
  symbolFontScale: 0.035,
  tickMs: 30,
  color: '180,220,50',
};
