# TextArea

A labelled `<textarea>` that the visitor can resize vertically.

## Usage

```tsx
import { TextArea } from 'react-shared-components';

<TextArea
  label="Message"
  placeholder="Tell me about your project"
  rows={5}
  value={message}
  onChange={(event) => setMessage(event.target.value)}
/>
```

## Props

| Prop        | Type     | Default   | Description                                          |
| ----------- | -------- | --------- | ---------------------------------------------------- |
| `label`     | `string` | none      | Shown above the text area and tied to it.            |
| `id`        | `string` | generated | Kept when given; otherwise one comes from `useId()`. |
| `className` | `string` | none      | Added to the wrapper, not the text area.             |

Every other `<textarea>` attribute (`rows`, `value`, `onChange`, `maxLength`, `required`) passes
straight through.

## Notes

- The minimum height is 120px; `resize: vertical` lets the visitor make it taller.
- The label is tied to the field with `htmlFor`, so screen readers announce it.
- For Markdown with a toolbar and a preview, use
  [`MarkdownEditor`](../MarkdownEditor/README.md).
