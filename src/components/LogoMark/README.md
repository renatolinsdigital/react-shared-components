# LogoMark

An animated SVG logo component with optional particle-constellation canvas, scroll-triggered mount animation, ambient glow pulse, and hover interaction. Fully configurable via props or named presets.

Config lives in `logoMarkConfig.ts` beside the component, exported as `LOGO_CONFIG`. It needs `gsap` (with its `ScrollTrigger` plugin, which the component registers itself).

---

## Basic Usage

```tsx
import { LogoMark } from 'react-shared-components';

// Default: 60 px, scroll-triggered assembly, ambient pulse
<LogoMark />

// Preset
<LogoMark preset="hero" />

// Fully custom
<LogoMark
  color="#00ffe0"
  size={120}
  opacity={0.85}
  showCanvas
  particleCount={40}
  glowIntensity={1}
  pulseSpeed={1.2}
/>
```

---

## Props

| Prop             | Type         | Default     | Description                                                     |
| ---------------- | ------------ | ----------- | --------------------------------------------------------------- |
| `color`          | `string`     | `#c8ff00`   | Accent color (hex). Applied to all SVG paths and canvas.        |
| `opacity`        | `number`     | `0.72`      | Overall path opacity (0 to 1).                                  |
| `size`           | `number`     | `60`        | Logo width in px. Height auto-scales from viewBox 196:282.      |
| `showCanvas`     | `boolean`    | `false`     | Render the particle-constellation canvas behind the logo.       |
| `pulse`          | `boolean`    | `true`      | Breathe the glow disc behind the logo.                          |
| `mountAnimation` | `boolean`    | `true`      | Enable scroll-triggered scatter → assemble mount animation.     |
| `glowIntensity`  | `number`     | `0.8`       | Multiplier for the canvas rings and centre glow (0 to 1+).      |
| `pulseSpeed`     | `number`     | `1`         | Speed multiplier for the ambient pulse (higher = faster).       |
| `particleCount`  | `number`     | `35`        | Number of canvas particles. Only active when `showCanvas=true`. |
| `preset`         | `LogoPreset` | `'default'` | Convenience preset. Overrides individual prop defaults.         |
| `className`      | `string`     | none        | Extra class added to the root container element.                |

### `LogoPreset` values

Sizes come from `defaults.size` (60) times the preset's `sizeRatio`.

| Preset    | Size | Canvas | Pulse | Mount | Notes                                   |
| --------- | ---- | ------ | ----- | ----- | --------------------------------------- |
| `default` | 60   | off    | on    | on    | Falls back to `defaults.*` in config.   |
| `footer`  | 24   | off    | on    | on    | Compact footer logo (`sizeRatio: 0.4`). |
| `hero`    | 227  | on     | on    | on    | Particle canvas, 45 particles (`3.78`). |
| `minimal` | 60   | off    | off   | off   | Instant display, no animations.         |

Any individual prop overrides the preset value:

```tsx
// hero size but custom color
<LogoMark preset="hero" color="#ff4466" />
```

---

## Config: `logoMarkConfig.ts`

Props are the way to customise an instance. `LOGO_CONFIG` holds the global defaults, the presets and the animation timing; it is exported read-only, so changing it means editing `logoMarkConfig.ts` in this repo and rebuilding.

Of the `canvas` group, the component reads only `defaultParticleCount` and `revealDuration`. The other `canvas` numbers record the values the draw loop uses, which are written into `LogoMark.tsx` itself: changing them in the config changes nothing yet.

```ts
LOGO_CONFIG = {
  defaults:  { size, color, opacity, glowIntensity },
  presets:   { footer, hero, minimal },   // sizeRatio, opacity, glowIntensity, ... per preset
  mountAnim: { scatterX, scatterY, rotationRange, scaleMin/Max,
               durationMin/Max, delayMax, ease,
               scrollStart, mountDelay },
  canvas:    { defaultParticleCount, maxOrbitFraction, orbitSpeedMin/Max,
               ringRadii, connectionMaxDistFraction,
               mouseRepelRadius, mouseRepelStrength, revealDuration },
}
```

---

## Animations

### Mount animation (`mountAnimation=true`)

Triggered by `ScrollTrigger` every time the component enters the viewport (replays on scroll-back).

1. All four SVG path groups are set to `opacity: 0`.
2. On viewport entry (after `mountDelay` seconds), each path is scattered to a random position, rotation and scale.
3. GSAP `fromTo` flies each path back to `x:0 y:0 rotation:0 scale:1 opacity:N` with randomised duration and delay, so each piece lands on its own beat.
4. Once the last path finishes, the ambient pulse begins.
5. On `onLeaveBack`, all tweens are killed and paths reset to hidden.

### Ambient pulse (`pulse=true`)

After mount completes, the `glowDisc` behind the logo scales 1→1.3 and back (sine.inOut, yoyo, repeat:-1). The paths themselves never carry a CSS `filter`: a blur or drop-shadow rasterises them, and at footer size the logo turns soft.

### Canvas reveal

When `showCanvas=true`, `animRef.current.progress` tweens from 0→1 over `revealDuration` seconds. All canvas draw calls multiply alpha and radius by this progress value for a smooth fade-in.

### Hover

`mouseenter` on the SVG wrapper scales `svgWrap` to 1.05 (`power2.out`, 0.35 s). `mouseleave` scales it back.

---

## Canvas System

Only active when `showCanvas=true`. Runs on `gsap.ticker` (rAF-synced).

### Particles

Each of the `particleCount` particles orbits the canvas center at a random radius (20 px → `maxOrbitFraction × min(w,h)`). On each tick:

- `angle += orbitSpeed × 0.006` (direction randomised per particle).
- Target position computed from angle + orbitRadius.
- Actual position lerps toward target (`factor 0.08`) for smooth orbital feel.
- Mouse proximity within `mouseRepelRadius` applies a repel force proportional to distance.
- Rendered as a small filled circle with a soft radial gradient halo. Alpha and radius pulse via a per-particle sine oscillator.

### Connections

O(n²) pairwise check: particles closer than `connectionMaxDistFraction × min(w,h)` are joined by a semi-transparent line whose opacity falls off linearly with distance.

### Rings

Four concentric dashed arcs (radii `[0.25, 0.45, 0.68, 0.88] × maxOrbit`). Each ring rotates at a different speed and alternating direction. Three equidistant node dots ride each ring.

### Center glow

A radial gradient centered on the canvas draws a soft ambient bleed behind the logo, sized `70 × animationProgress × glowIntensity` px.

---

## SVG Structure

The logo SVG uses `viewBox="0 0 196 282"` and consists of four named path groups:

| Ref          | Description             |
| ------------ | ----------------------- |
| `borderRef`  | Outer rectangular frame |
| `rFillRef`   | Diagonal R body fill    |
| `lCornerRef` | Bottom-left triangle    |
| `rCircleRef` | Round bowl of the R     |

Each `<g>` has `transform-box: fill-box` so GSAP scatter transforms rotate around the path's own bounding-box center.

---

## CSS Classes

| Class         | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `.container`  | Root `inline-flex` container. Full-width when canvas on.                |
| `.withCanvas` | Applied when `showCanvas=true`. Expands container.                      |
| `.canvas`     | Absolute-inset canvas element. `pointer-events: none`.                  |
| `.glowDisc`   | Centered absolute div for ambient radial glow.                          |
| `.svgWrap`    | Positioned above canvas (`z-index: 1`). Handles hover.                  |
| `.svg`        | `overflow: visible` so scattered paths fly in from outside the viewBox. |
| `.logoPath`   | Applied to every `<g>`. `transform-box: fill-box`.                      |

Neither `.svgWrap` nor `.logoPath` sets `will-change`: it makes Chrome rasterise the vector once and scale the bitmap, which blurs the logo on hover.

---

## Cleanup

The `useEffect` returns a full cleanup function that:

- Removes the GSAP ticker draw listener.
- Disconnects the canvas `ResizeObserver`.
- Kills all active tweens and the `ScrollTrigger` instance.
- Removes `mousemove` / `mouseleave` / `mouseenter` event listeners.
- Clears the delayed `ScrollTrigger.refresh()` and disconnects the `ResizeObserver` on `<body>` that refreshes ScrollTrigger whenever the page height changes.

---

## Theme and accessibility

- The SVG fills and the canvas cannot read the CSS colour tokens. Pass the theme's accent as `color`: `#c8ff00` on the dark palette, `#527300` on the light one.
- The `<svg>` is named "Renato Lins logo" through `aria-label`.
- The animations do not yet honour `prefers-reduced-motion`. For a still logo, use `preset="minimal"` or `mountAnimation={false} pulse={false}`.
