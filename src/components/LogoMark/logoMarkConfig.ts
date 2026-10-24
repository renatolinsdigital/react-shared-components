/**
 * LogoMark: animated SVG logo configuration
 *
 * Edit values here to tune the logo globally.
 * Individual instances can still override anything via props.
 * See README.md beside this file for the full props reference.
 *
 * HOW SIZE WORKS:
 *   defaults.size is the base size. Every preset scales relative to it via
 *   sizeRatio (e.g. footer 0.4 × 60 = 24, hero 3.78 × 60 ≈ 227).
 *   Change defaults.size and ALL logos scale proportionally.
 *
 * HOW PRESETS WORK:
 *   Presets are partial overrides: any field not specified inherits from
 *   defaults. Explicit props on <LogoMark> win over both.
 */
export const LOGO_CONFIG = {
  // ── Defaults ───────────────────────────────────────────────────────────────
  // Base values for every LogoMark instance. Presets override individual
  // fields; anything a preset doesn't specify falls through to here.

  defaults: {
    /** Base logo width in px; all presets scale relative to this */
    size: 60,
    /** Accent fill color, matches $color-accent */
    color: '#c8ff00',
    /** Path fill opacity (0 to 1) */
    opacity: 0.72,
    /** Canvas glow and ring intensity multiplier (0 to 1) */
    glowIntensity: 0.8,
  },

  // ── Presets ────────────────────────────────────────────────────────────────
  // Only specify what differs from defaults. sizeRatio multiplies defaults.size.
  // Height is always derived from width automatically (viewBox 196:282).

  presets: {
    /** Footer (×2): compact inline logo */
    footer: { sizeRatio: 0.4, opacity: 0.55, glowIntensity: 0.5 },
    /** Hero / about: large logo with particle canvas */
    hero: {
      sizeRatio: 3.78,
      opacity: 0.88,
      glowIntensity: 1.0,
      showCanvas: true,
      particleCount: 45,
    },
    /** Silent: no pulse, no mount animation */
    minimal: { opacity: 0.4, glowIntensity: 0.3, pulse: false, mountAnimation: false },
  },

  // ── Mount animation ────────────────────────────────────────────────────────
  // Paths scatter to random positions then fly in to form the logo.
  // Replays each time the logo enters the viewport.

  mountAnim: {
    scatterX: [-110, 110] as [number, number], // horizontal scatter range [min, max] px
    scatterY: [-70, 70] as [number, number], // vertical scatter range [min, max] px
    rotationRange: [-135, 135] as [number, number], // rotation scatter [min, max] degrees
    scaleMin: 0.05, // minimum initial scale of a scattered path
    scaleMax: 0.4, // maximum initial scale of a scattered path
    durationMin: 0.4, // minimum fly-in duration per path (seconds)
    durationMax: 0.7, // maximum fly-in duration per path (seconds)
    delayMax: 0.3, // maximum random stagger between paths (seconds)
    ease: 'back.out(1.4)',
    scrollStart: 'top 95%', // ScrollTrigger: when logo top hits 95% of viewport
    mountDelay: 0.4, // seconds to wait after scroll trigger before playing
  },

  // ── Particle canvas ────────────────────────────────────────────────────────
  // Only active when showCanvas=true. Particles orbit the centre, connect with
  // faint lines, and repel from the mouse cursor.

  canvas: {
    defaultParticleCount: 35, // default when no particleCount prop is set
    maxOrbitFraction: 0.44, // max orbit radius as fraction of container short side
    orbitSpeedMin: 0.15, // slowest orbital angular speed
    orbitSpeedMax: 0.6, // fastest orbital angular speed
    particleSizeMin: 1, // smallest particle dot (px)
    particleSizeMax: 3.5, // largest particle dot (px)
    pulseSpeedMin: 0.4, // slowest per-particle alpha oscillation
    pulseSpeedMax: 2.0, // fastest per-particle alpha oscillation
    ringRadii: [0.25, 0.45, 0.68, 0.88] as number[], // concentric ring radii (fraction of maxOrbit)
    connectionMaxDistFraction: 0.18, // max distance for connection lines (fraction of short side)
    mouseRepelRadius: 90, // repel zone radius (px)
    mouseRepelStrength: 30, // max pixel deflection at repel zone center
    revealDuration: 2, // canvas fade-in duration on viewport entry (seconds)
  },
} as const;

export type LogoConfig = typeof LOGO_CONFIG;
