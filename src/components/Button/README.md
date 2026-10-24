# Button

A native `<button>` in four variants and three sizes: a pill with uppercase text, drawn from the
theme tokens.

## Usage

```tsx
import { Button } from 'react-shared-components';

<Button type="submit">Save project</Button>
<Button type="button" variant="secondary" onClick={openPreview}>Preview</Button>
<Button type="button" variant="ghost" size="small">Cancel</Button>
<Button type="button" variant="danger">Delete</Button>
<Button type="submit" fullWidth size="large">Send message</Button>
```

## Props

| Prop        | Type                                              | Default     | Description                                  |
| ----------- | ------------------------------------------------- | ----------- | -------------------------------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual weight. See below.                    |
| `size`      | `'small' \| 'medium' \| 'large'`                  | `'medium'`  | Padding and font size.                       |
| `fullWidth` | `boolean`                                         | `false`     | Stretches the button to its container.       |
| `children`  | `ReactNode`                                       | required    | The label. Icons sit beside text with a gap. |
| `className` | `string`                                          | none        | Added after the internal classes.            |

Every other `<button>` attribute (`type`, `onClick`, `disabled`, `aria-*`) passes straight through.

### Variants

| Variant     | Looks like                           | Use for                      |
| ----------- | ------------------------------------ | ---------------------------- |
| `primary`   | Accent fill, glows on hover          | The main action of a view    |
| `secondary` | Outline that turns accent on hover   | A second, lighter action     |
| `ghost`     | Text only, faint background on hover | Cancel, close, minor actions |
| `danger`    | Red outline, red tint on hover       | Delete and other destructive |

## Notes

- The browser default for `type` is `submit`. Inside a form, a button that should not submit the
  form needs `type="button"`.
- The children sit in an inner `<span>` above a hover overlay, so the overlay never covers the
  label.
- There is no disabled style yet: `disabled` works, but the button looks the same.
