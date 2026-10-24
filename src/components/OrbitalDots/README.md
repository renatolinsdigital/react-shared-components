# OrbitalDots

A reusable wrapper component that renders an animated particle-network canvas in its
background: drifting glowing dots connected by proximity-based lines, an optional dashed
orbit ring, and floating code-syntax symbols.

All content passed as `children` is rendered on top of the canvas via a
`position: relative; z-index: 1` stacking layer, the same pattern as
`MatrixContainer`.

**Files:**

- `OrbitalDots.tsx`: the component
- `orbitalDotsConfig.ts`: the default config (`ORBITAL_DOTS_CONFIG`) and its TypeScript interface

---

## Usage

```tsx
import { OrbitalDots } from 'react-shared-components';

// Basic: renders as a <div> and fills its parent
<OrbitalDots className={styles.heroVisual} />

// With content on top
<OrbitalDots className={styles.aboutVisual}>
  <p>Content appears above the animation</p>
</OrbitalDots>

// Semantic element
<OrbitalDots as="section" id="about" className={styles.section}>
  <AboutContent />
</OrbitalDots>

// Dimmed (same pattern as MatrixContainer's canvasOpacity)
<OrbitalDots canvasOpacity={0.6} className={styles.sidebar} />

// Config override: fewer, faster dots, no symbols
<OrbitalDots
  config={{ dotCount: 20, speed: 0.7, showSymbols: false, showOrbitRing: false }}
  className={styles.smallWidget}
/>

// Forward ref for scroll triggers or measurements
const visualRef = useRef<HTMLElement>(null);
<OrbitalDots as="aside" ref={visualRef} className={styles.panel} />
```

### Sizing

`OrbitalDots` sets `position: relative; overflow: hidden` on its wrapper.
It does **not** impose any size: add dimensions via `className` or `style`:

```scss
// Explicit size
.heroVisual {
  width: 100%;
  height: 600px;
}

// Fill a flex/grid cell
.panel {
  flex: 1;
  min-height: 400px;
}

// Square
.widget {
  width: 300px;
  aspect-ratio: 1;
}
```

The canvas adapts automatically whenever the wrapper resizes thanks to a `ResizeObserver`.

---

## Props

| Prop            | Type                         | Default | Description                                                                                                                                         |
| --------------- | ---------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`      | `ReactNode`                  | none    | Rendered above the canvas                                                                                                                           |
| `config`        | `Partial<OrbitalDotsConfig>` | none    | Merged with `ORBITAL_DOTS_CONFIG` once, at mount. Later changes are ignored, so an inline object is fine; remount the component to apply a new one. |
| `canvasOpacity` | `number`                     | `1`     | CSS `opacity` on the `<canvas>` element. Dims the entire effect without altering individual dot/line opacities in config.                           |
| `as`            | `React.ElementType`          | `'div'` | HTML element to render as wrapper (`'section'`, `'aside'`, `'footer'`, etc.)                                                                        |
| `className`     | `string`                     | none    | Merged onto the wrapper element                                                                                                                     |
| `style`         | `CSSProperties`              | none    | Inline styles on the wrapper                                                                                                                        |
| `id`            | `string`                     | none    | `id` attribute on the wrapper                                                                                                                       |
| `ref`           | `Ref<HTMLElement>`           | none    | Forwarded to the wrapper element via `React.forwardRef` (written before React 19 made `ref` a plain prop)                                           |

---

## Configuration

All defaults live in `orbitalDotsConfig.ts`, exported as `ORBITAL_DOTS_CONFIG`. A canvas cannot
read the CSS colour tokens, so a themed page passes the accent as `color` and remounts on a
theme change (`key={theme}`), since the config is read once.

```ts
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
```

Pass overrides via the `config` prop:

```tsx
<OrbitalDots config={{ dotCount: 20, speed: 0.6, showSymbols: false }} />
```

> **Note:** Config is captured once at mount via `useRef`. Changes to the prop after mount
> are ignored: remount the component to apply new config.

### Parameter reference

| Parameter         | Type       | Description                                                                                  |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `dotCount`        | `number`   | Total floating dot nodes. More = denser network.                                             |
| `maxLineDistance` | `number`   | Max px distance between two dots for a connector line to draw.                               |
| `dotMinRadius`    | `number`   | Minimum dot radius in pixels.                                                                |
| `dotMaxRadius`    | `number`   | Maximum dot radius in pixels.                                                                |
| `speed`           | `number`   | Velocity multiplier. Each dot's vx/vy is a random unit vector × speed.                       |
| `lineOpacity`     | `number`   | Max opacity of a connector line (at distance 0). Falls to 0 at `maxLineDistance`.            |
| `dotOpacityMin`   | `number`   | Each dot gets a random opacity in [`dotOpacityMin`, 1].                                      |
| `glowBlur`        | `number`   | `ctx.shadowBlur` value applied to all dots for the bloom glow. Higher = softer, larger glow. |
| `showOrbitRing`   | `boolean`  | Whether to draw the dashed circle ring at the canvas centre.                                 |
| `orbitRingRadius` | `number`   | Ring radius as a fraction of `min(width, height)`. `0.27` = 27% of the shortest edge.        |
| `showSymbols`     | `boolean`  | Whether to render floating code symbols.                                                     |
| `symbols`         | `string[]` | Array of strings to scatter. Default: `['{ }', '[ ]', '</ >', '( )']`.                       |
| `symbolFontScale` | `number`   | Symbol font size as a fraction of `min(width, height)`. `0.035` = 3.5% of shortest edge.     |
| `tickMs`          | `number`   | Milliseconds per draw frame (lower = smoother, more CPU).                                    |
| `color`           | `string`   | RGB triple `'R,G,B'` for dots, lines, ring, and symbols.                                     |

### Effect of tuning each parameter

| Parameter         | Increase                   | Decrease                       |
| ----------------- | -------------------------- | ------------------------------ |
| `dotCount`        | Denser web of connections  | Sparse, isolated nodes         |
| `maxLineDistance` | More connections per dot   | Dots mostly unconnected        |
| `speed`           | Nervous, fast-moving swarm | Slow, meditative drift         |
| `lineOpacity`     | Bright grid-like structure | Nearly invisible connectors    |
| `dotOpacityMin`   | All dots fully bright      | Mix of bright and ghostly dots |
| `glowBlur`        | Wide soft bloom            | Sharp point-like dots          |
| `orbitRingRadius` | Larger ring                | Tight centre ring              |
| `symbolFontScale` | Large symbols              | Tiny hints of symbols          |
| `tickMs`          | Slow (choppy) animation    | Smooth (expensive) animation   |

---

## Presets

### Minimal / ambient background

```ts
{
  dotCount: 18,
  maxLineDistance: 80,
  speed: 0.2,
  lineOpacity: 0.15,
  dotOpacityMin: 0.3,
  glowBlur: 6,
  showOrbitRing: false,
  showSymbols: false,
}
```

### Default (balanced density, with symbols)

```ts
// ORBITAL_DOTS_CONFIG: no override needed
```

### Dense constellation (hero / feature panel)

```ts
{
  dotCount: 55,
  maxLineDistance: 130,
  speed: 0.5,
  lineOpacity: 0.35,
  dotOpacityMin: 0.5,
  glowBlur: 14,
  showOrbitRing: true,
  orbitRingRadius: 0.32,
}
```

### Monochrome (white / grey)

```ts
{ color: '220,220,220', glowBlur: 6, lineOpacity: 0.15 }
```

---

## How it works

### Canvas setup

`OrbitalDots.module.scss` positions the canvas absolutely to fill the wrapper:

```scss
.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
```

`pointer-events: none` ensures the canvas never intercepts clicks or hovers.
The canvas background is never painted: only the dots and lines are drawn.

### Dot model

Each dot is a plain object:

```ts
interface Dot {
  x: number; // current X position (pixels)
  y: number; // current Y position (pixels)
  vx: number; // X velocity (pixels per frame)
  vy: number; // Y velocity (pixels per frame)
  radius: number; // drawn radius (pixels)
  opacity: number; // fill opacity (0 to 1)
}
```

Dots are initialised with random positions and random velocity vectors scaled by `speed`.
On each tick, `x += vx` and `y += vy`. When a dot reaches a canvas edge it reverses the
corresponding velocity component (elastic wall bounce).

### Proximity line algorithm

```
for i in 0..dots.length:
  for j in i+1..dots.length:
    dist = euclidean(dots[i], dots[j])
    if dist < maxLineDistance:
      alpha = (1 - dist / maxLineDistance) * lineOpacity
      drawLine(dots[i], dots[j], alpha)
```

Complexity is O(n²) per frame. For `dotCount ≤ 60` this is imperceptible on modern hardware.
Avoid `dotCount > 80` in production if smooth animation matters.

### Glow technique

Rather than creating a `RadialGradient` per dot (expensive), the glow uses Canvas 2D's
built-in shadow system:

```ts
ctx.shadowColor = `rgba(${r},${g},${b},0.55)`;
ctx.shadowBlur = cfg.glowBlur;
// draw all dots
ctx.shadowBlur = 0; // reset, so the shadow does not bleed into lines or symbols
```

`shadowBlur` is set once before the entire dot pass and reset after so lines and symbols
are unaffected.

### Symbol fading

Each `FloatingSymbol` has an `opacity` and a `targetOpacity`. Every tick the opacity steps
toward its target by `fadeSpeed`. When it arrives, a new random `targetOpacity` is chosen,
creating a continuous slow cross-fade. Symbol positions are normalised (0 to 1) and multiplied
by `canvas.width / canvas.height` at draw time so they scale correctly with the container.

### Orbit ring

A dashed `arc` at `(cx, cy, orbitRingRadius * min(w,h))`. The line-dash pattern `[3, 9]`
produces short dashes with wide gaps. Drawn at `rgba(..., 0.10)` so it stays subtle: a
structural hint, not a focal point.

### Resize handling

A `ResizeObserver` on the canvas element fires `resize()` whenever the wrapper changes
dimensions. `resize()` writes new pixel dimensions to `canvas.width/height` and calls
`initDots()` + `initSymbols()`, reinitialising all state for the new size.

### Cleanup

The `useEffect` return function:

```ts
return () => {
  cancelAnimationFrame(rafId);
  ro.disconnect();
};
```

---

## Comparison with MatrixContainer

| Feature                    | MatrixContainer       | OrbitalDots                      |
| -------------------------- | --------------------- | -------------------------------- |
| Effect                     | Katakana rain columns | Particle network + constellation |
| Canvas fills wrapper       | ✓                     | ✓                                |
| ResizeObserver             | ✓                     | ✓                                |
| `children` on top          | ✓                     | ✓                                |
| `as` prop                  | ✓                     | ✓                                |
| `ref` forwarding           | ✓                     | ✓                                |
| `canvasOpacity`            | ✓                     | ✓                                |
| Config file                | `matrixConfig.ts`     | `orbitalDotsConfig.ts`           |
| Config changes after mount | applied live          | ignored until remount            |
| Shadow/glow                | ✗                     | ✓ (shadowBlur)                   |
| Orbit ring                 | ✗                     | ✓ (optional)                     |
| Code symbols               | ✗                     | ✓ (optional)                     |
