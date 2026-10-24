# MatrixContainer

A wrapper that draws animated katakana rain on a canvas behind its children. The canvas fills the
wrapper, follows its size, and takes config changes live, without restarting.

Ported from the standalone [matrix-container](https://github.com/renatolinsdigital/matrix-container)
repo.

## Usage

```tsx
import { MATRIX_THEME_CONFIG, MatrixContainer } from 'react-shared-components';

<MatrixContainer as="section" className={styles.hero}>
  <h1>Content sits above the rain</h1>
</MatrixContainer>

// Dimmed, with fewer and slower columns
<MatrixContainer canvasOpacity={0.4} config={{ columnDensity: 0.3, tickMs: 120 }}>
  ...
</MatrixContainer>

// Following the site theme (theme is 'dark' or 'light')
const matrixConfig = useMemo(() => MATRIX_THEME_CONFIG[theme], [theme]);
<MatrixContainer config={matrixConfig}>...</MatrixContainer>
```

### Sizing

The wrapper gets `position: relative; overflow: hidden` and no size. Give it one through
`className` or `style` (a height, a flex or grid cell). The canvas follows through a
`ResizeObserver`.

## Props

| Prop            | Type                    | Default | Description                                                    |
| --------------- | ----------------------- | ------- | -------------------------------------------------------------- |
| `children`      | `ReactNode`             | none    | Rendered above the canvas.                                     |
| `config`        | `Partial<MatrixConfig>` | none    | Merged over `MATRIX_CONFIG`. Changes apply live. See below.    |
| `canvasOpacity` | `number`                | `1`     | CSS opacity of the canvas, 0 to 1. Dims the whole effect.      |
| `as`            | `ElementType`           | `'div'` | The wrapper element, such as `'section'` or `'footer'`.        |
| `className`     | `string`                | none    | Added to the wrapper.                                          |
| `style`         | `CSSProperties`         | none    | Inline styles on the wrapper.                                  |
| `id`            | `string`                | none    | `id` on the wrapper.                                           |
| `ref`           | `Ref<HTMLElement>`      | none    | Forwarded to the wrapper (`forwardRef`, from before React 19). |

## Config

Defaults, exported as `MATRIX_CONFIG` from `matrixConfig.ts`:

| Field             | Default         | Description                                                          |
| ----------------- | --------------- | -------------------------------------------------------------------- |
| `chars`           | 46 katakana     | The glyph pool; one is picked at random for every cell drawn.        |
| `fontSize`        | `14`            | Glyph size in px, which is also the grid cell size.                  |
| `columnDensity`   | `1`             | Chance (0 to 1) that a column carries a stream. 0.25 is one in four. |
| `tickMs`          | `60`            | Milliseconds between steps. Higher falls slower.                     |
| `trailLength`     | `10`            | Rows in the fading tail behind the head glyph.                       |
| `headOpacity`     | `0.2`           | Opacity of the leading glyph, 0 to 1.                                |
| `trailOpacityMax` | `0.1`           | Opacity of the brightest glyph behind the head.                      |
| `color`           | `'210,255,120'` | Glyph colour as an `'R,G,B'` triple.                                 |

The defaults are drawn for a dark background, and kept faint on purpose: the rain sits behind
text. `MATRIX_THEME_CONFIG` holds an override per theme. Its `light` entry swaps to a deeper
green, drawn stronger, because lime glyphs vanish on a light page.

### Live config

`config` is merged over the defaults at mount and then kept live. A later change is applied to
the running animation in place: no remount, no new canvas. A change of `fontSize` or
`columnDensity` also re-seeds the columns at once, scattered down the canvas, so it shows
immediately instead of trickling in.

Pass a stable object (a constant, or from `useMemo`): a new object on every render makes the
component merge on every render.

## How it works

- The canvas is a grid of square cells, `fontSize` wide. Each column tracks the row of its
  falling head glyph.
- A `requestAnimationFrame` loop redraws every `tickMs`. Each glyph is re-picked on every frame,
  which gives the flicker.
- When a stream's tail leaves the bottom, the column either restarts near the top or pauses for a
  while, by `columnDensity`.
- Unmounting cancels the animation frame and disconnects the observer.

## Theme note

A canvas cannot read the CSS colour tokens. A caller that knows the theme passes the colour in
`config`, as `MATRIX_THEME_CONFIG` does.
