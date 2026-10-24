# ShimmerImage

An `<img>` that fills its parent, shows a shimmer while the file loads and fades the picture in,
from a soft blur, once it has decoded. Made for covers and thumbnails.

## Usage

The parent must be positioned and sized, because the image fills it:

```tsx
import { ShimmerImage } from 'react-shared-components';

<div className={styles.cover}>
  <ShimmerImage src={project.coverUrl} alt={project.coverAlt} className={styles.coverImage} />
</div>
```

```scss
.cover {
  position: relative;
  aspect-ratio: 4 / 3;
}
```

## Props

| Prop        | Type     | Default  | Description                                                   |
| ----------- | -------- | -------- | ------------------------------------------------------------- |
| `src`       | `string` | required | The image URL.                                                |
| `alt`       | `string` | required | Describes the picture. Pass `""` for a decorative one.        |
| `className` | `string` | none     | Lands on the `<img>` itself, for hover zooms or GSAP targets. |

Every other `<img>` attribute (`srcSet`, `sizes`, `loading`, `decoding`) passes straight through,
except `onLoad`, which the component uses.

## Behaviour

- The image covers its parent (`object-fit: cover`). Override it with `className`.
- The fade runs on a wrapper, never on the `<img>`, so a caller can animate the image's own
  `transform` and `filter` without the two fighting.
- Each `src` is tracked on its own: give a mounted component a new `src` and it shimmers again
  instead of popping in.
- A cached image can finish loading before hydration attaches `onLoad`. The component checks for
  an image that is already complete, so it never shimmers forever after server rendering.
- Visitors who ask for reduced motion get no shimmer sweep and no blur, only the fade.

## Next.js

This is a plain `<img>`, so it does not go through the `next/image` optimizer. Pass `srcSet` and
`sizes` yourself when responsive images matter, or use a CDN that resizes by URL (the demo asks
Unsplash for `?w=800`).
