# Markdown

Renders a Markdown string as React elements, with GitHub-flavoured extras. Safe for text that
users typed.

## Usage

```tsx
import { Markdown } from 'react-shared-components';

<Markdown className={styles.prose}>{post.content}</Markdown>
```

## Props

| Prop        | Type     | Default  | Description                               |
| ----------- | -------- | -------- | ----------------------------------------- |
| `children`  | `string` | required | The Markdown source.                      |
| `className` | `string` | none     | Put on the wrapping `<div>`, for styling. |

## What it renders

- Standard Markdown: headings, lists, emphasis, code, quotes, images, links.
- GitHub extras through `remark-gfm`: tables, `~~strikethrough~~`, task lists and bare URLs.
- Every link opens in a new tab with `rel="noopener noreferrer"`, so the new page gets no handle
  back to this one.

## Safety

- Raw HTML in the source is escaped and shown as text. A `<script>` in a post never runs.
- Unsafe link protocols such as `javascript:` are dropped from `href`.

## Styling

It ships no typography of its own: the output is bare `h2`, `p`, `ul`, `table` and so on. Style
them through `className`, for example:

```scss
.prose {
  h2 {
    margin: 0 0 0.5em;
  }
  a {
    color: var(--color-accent);
  }
  th,
  td {
    border: 1px solid var(--color-border);
  }
}
```

[`MarkdownEditor`](../MarkdownEditor/README.md) uses this component for its preview, with a full
set of prose styles.

## Dependencies

`react-markdown` and `remark-gfm`, installed with the library.
