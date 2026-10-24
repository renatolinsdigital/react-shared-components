# PageTransition

Fades its content in on mount, and again whenever `transitionKey` changes. It knows nothing about
routers: give it the current pathname and it fades on every navigation.

## Usage

```tsx
import { PageTransition } from 'react-shared-components';

// Next.js App Router, in a client layout
const pathname = usePathname();
<PageTransition transitionKey={pathname}>{children}</PageTransition>

// React Router
const { pathname } = useLocation();
<PageTransition transitionKey={pathname}>
  <Outlet />
</PageTransition>

// Fade in once, on mount
<PageTransition>{content}</PageTransition>
```

## Props

| Prop            | Type        | Default  | Description                                 |
| --------------- | ----------- | -------- | ------------------------------------------- |
| `children`      | `ReactNode` | required | The content to fade.                        |
| `transitionKey` | `string`    | none     | A change fades the content out and back in. |

## How it works

1. When the key changes, the wrapper drops to `opacity: 0` in the same commit.
2. Two `requestAnimationFrame` calls let the browser paint that hidden frame.
3. The wrapper goes back to `opacity: 1` over 0.4s.

The content is not remounted: only the wrapper's opacity changes, so state inside it survives.
