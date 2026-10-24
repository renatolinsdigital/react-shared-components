# Toast

Stacked notifications in the top right corner, each with an icon, its own timer, a progress bar
and a close button. `ToastProvider` wraps the app once; `useToast()` adds a toast from anywhere
below it.

## Usage

```tsx
import { ToastProvider, useToast } from 'react-shared-components';

// Once, near the root
<ToastProvider dismissLabel="Dismiss notification">
  <App />
</ToastProvider>

// Anywhere below it
function SaveButton() {
  const { addToast } = useToast();

  const save = async () => {
    try {
      await saveProject();
      addToast('Project saved.');
    } catch {
      addToast('Could not reach the server.', 'error');
    }
  };

  return <button onClick={save}>Save</button>;
}
```

## API

### `ToastProvider` props

| Prop           | Type        | Description                                       |
| -------------- | ----------- | ------------------------------------------------- |
| `dismissLabel` | `string`    | The accessible name of each toast's close button. |
| `children`     | `ReactNode` | The app.                                          |

### `useToast()`

Returns `{ addToast }`:

```ts
addToast(message: string, variant?: ToastVariant, durationMs?: number): void
```

| Argument     | Type           | Default     | Description                       |
| ------------ | -------------- | ----------- | --------------------------------- |
| `message`    | `string`       | required    | The text of the toast.            |
| `variant`    | `ToastVariant` | `'success'` | Colour and icon. See below.       |
| `durationMs` | `number`       | `4000`      | How long it stays before leaving. |

### Variants

| `ToastVariant` | Icon | Colour |
| -------------- | ---- | ------ |
| `success`      | ✓    | green  |
| `error`        | ✕    | red    |
| `warning`      | ⚠    | amber  |
| `info`         | ℹ    | blue   |

## Behaviour

- Toasts stack in a fixed column, 360px wide, at the top right (`z-index: 9999`).
- Each toast slides in, runs its progress bar for `durationMs`, then slides out over 220ms.
- The close button removes a toast early and cancels its timer.
- Unmounting the provider clears every pending timer.
- `useToast()` outside a provider returns an `addToast` that does nothing, rather than throwing.

## Known limitations

- The stack is not an `aria-live` region, so screen readers do not announce new toasts.
