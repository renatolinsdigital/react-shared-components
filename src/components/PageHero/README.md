# PageHero

The intro block at the top of a listing page: an eyebrow, the page title, a subtitle, a counter
badge and an accent line that grows in.

## Usage

```tsx
import { PageHero } from 'react-shared-components';

<PageHero
  eyebrow="Blog"
  title="Notes on motion"
  subtitle="Essays on animation, canvas and building for the web."
  count={posts.length}
  countLabel="posts"
/>
```

## Props

All props are required.

| Prop         | Type     | Description                                      |
| ------------ | -------- | ------------------------------------------------ |
| `eyebrow`    | `string` | Small accent label above the title.              |
| `title`      | `string` | The page title, rendered as the page's `<h1>`.   |
| `subtitle`   | `string` | One or two sentences under the title.            |
| `count`      | `number` | The number in the badge, such as the post total. |
| `countLabel` | `string` | What the number counts, such as `"posts"`.       |

## Layout

- It renders a [`Section`](../Section/README.md) without padding, holding a
  [`Container`](../Container/README.md).
- The top padding is the navbar height (72px) plus 2rem, or 3rem from 768px up, so the title
  clears a fixed navbar.
- On phones the parts stack: eyebrow, count, title, subtitle, line. From 768px the count moves to
  a badge in the top right corner.

## Notes

- The title is an `<h1>`: use one `PageHero` per page.
- The accent line grows from the left once, 0.2s after mount.
