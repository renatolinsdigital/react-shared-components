# Section

A full-width page band: a `<section>` with vertical rhythm, on the page background or on a raised
surface. Pair it with [`Container`](../Container/README.md) to cap the width of what is inside.

## Usage

```tsx
import { Container, Section } from 'react-shared-components';

<Section id="projects">
  <Container>...</Container>
</Section>

<Section variant="elevated">
  <Container>...</Container>
</Section>
```

## Props

| Prop        | Type                   | Default  | Description                                                      |
| ----------- | ---------------------- | -------- | ---------------------------------------------------------------- |
| `children`  | `ReactNode`            | required | The content.                                                     |
| `variant`   | `'dark' \| 'elevated'` | `'dark'` | `dark` is the page background; `elevated` is the raised surface. |
| `noPadding` | `boolean`              | `false`  | Drops the vertical padding.                                      |
| `id`        | `string`               | none     | For in-page links (`#projects`).                                 |
| `className` | `string`               | none     | Added after the internal classes.                                |

## Notes

- Vertical padding is 4rem, and 5rem from 768px up.
- `dark` is named after the default palette. It means "page background", so in the light theme it
  is light.
