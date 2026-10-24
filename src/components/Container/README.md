# Container

Centres its content and caps its width, with side padding so text never touches the screen edge.

## Usage

```tsx
import { Container } from 'react-shared-components';

<Container>Up to 1400px wide</Container>
<Container narrow>Up to 900px wide, for reading text</Container>
<Container as="article" narrow>{post}</Container>
```

## Props

| Prop        | Type          | Default  | Description                                 |
| ----------- | ------------- | -------- | ------------------------------------------- |
| `children`  | `ReactNode`   | required | The content.                                |
| `narrow`    | `boolean`     | `false`  | Caps the width at 900px instead of 1400px.  |
| `as`        | `ElementType` | `'div'`  | The element to render, such as `'article'`. |
| `className` | `string`      | none     | Added after the internal classes.           |

## Notes

- Side padding is 2rem; the width cap includes it (`box-sizing: border-box`).
- The container owns its own `margin` and `padding`. To space it from what sits above or below,
  put the spacing on a wrapper rather than on `className`, where it would fight the container's
  own rules.
