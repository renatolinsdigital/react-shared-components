# Select

A labelled native `<select>` with a custom arrow and an empty first option as its placeholder.

## Usage

```tsx
import { Select } from 'react-shared-components';

<Select
  label="Service"
  placeholder="Select a service..."
  options={[
    { value: 'website', label: 'Website' },
    { value: 'branding', label: 'Branding' },
  ]}
  value={service}
  onChange={(event) => setService(event.target.value)}
/>
```

## Props

| Prop          | Type                                 | Default   | Description                                          |
| ------------- | ------------------------------------ | --------- | ---------------------------------------------------- |
| `placeholder` | `string`                             | required  | The text of the empty first option.                  |
| `options`     | `{ value: string; label: string }[]` | required  | The choices, in order.                               |
| `label`       | `string`                             | none      | Shown above the select and tied to it.               |
| `id`          | `string`                             | generated | Kept when given; otherwise one comes from `useId()`. |
| `className`   | `string`                             | none      | Added to the wrapper, not the select.                |

Every other `<select>` attribute (`value`, `defaultValue`, `onChange`, `required`, `name`) passes
straight through.

## Notes

- The placeholder option has the value `""`. Add `required` to stop a form submitting until the
  visitor picks something real.
- Uncontrolled, pass `defaultValue=""` so the placeholder shows first.
- The arrow is an inline SVG in a fixed grey (`#999`) that reads on both themes but does not
  follow them.
