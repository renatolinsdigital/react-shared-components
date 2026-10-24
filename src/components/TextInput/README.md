# TextInput

A labelled `<input>` with an optional error message underneath.

## Usage

```tsx
import { TextInput } from 'react-shared-components';

<TextInput label="Name" placeholder="Ada Lovelace" />

<TextInput
  label="Email"
  type="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  error={emailError}
/>
```

## Props

| Prop        | Type     | Default   | Description                                                 |
| ----------- | -------- | --------- | ----------------------------------------------------------- |
| `label`     | `string` | none      | Shown above the input and tied to it.                       |
| `error`     | `string` | none      | Turns the border red and shows the message below the input. |
| `id`        | `string` | generated | Kept when given; otherwise one comes from `useId()`.        |
| `className` | `string` | none      | Added to the wrapper, not the input.                        |

Every other `<input>` attribute (`type`, `value`, `onChange`, `required`, `autoComplete`) passes
straight through to the input.

## Accessibility

- The `<label>` points at the input with `htmlFor`, so a screen reader announces the field by its
  label and a click on the label focuses the input.
- On focus the border turns accent and a soft accent ring appears in place of the browser outline.

## Known limitations

- The error message is not yet tied to the input with `aria-describedby`, and the input does not
  set `aria-invalid`. A screen reader user hears the error only by reading on past the field.
