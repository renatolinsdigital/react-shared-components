# PageTransition

Fades its content in on mount, and again whenever `transitionKey` changes. It knows nothing about
routers: give it the current pathname and it fades on every navigation.

## Usage

```tsx
import { PageTransition } from 'react-shared-components';

// Next.js App Router, in a client layout
const pathname = usePathname();
<PageTransition transitionKey={pathname} appear={false}>{children}</PageTransition>

// React Router
const { pathname } = useLocation();
<PageTransition transitionKey={pathname}>
  <Outlet />
</PageTransition>

// Fade in once, on mount
<PageTransition>{content}</PageTransition>
```

## Props

| Prop            | Type        | Default  | Description                                                                         |
| --------------- | ----------- | -------- | ----------------------------------------------------------------------------------- |
| `children`      | `ReactNode` | required | The content to fade.                                                                |
| `transitionKey` | `string`    | none     | A change fades the content out and back in.                                         |
| `appear`        | `boolean`   | `true`   | Fade in on mount. `false` shows the first content at once; only a key change fades. |

## Server rendering

With the default `appear`, the wrapper renders at `opacity: 0` and fades in only after the
component mounts in the browser. On a server-rendered page (Next.js, TanStack Start, Remix) that
leaves the page blank in the server HTML until the scripts load and hydrate: seconds on a slow
phone, and for good if they fail. Pass `appear={false}` there. The first page then shows in the
server HTML, and every later navigation still fades.

A page whose own entrances start hidden (a GSAP `from()` run in an effect) will show them flash
once `appear` is off: the content is visible in the first paint, hidden when the effect runs,
then animated. Leave content that is already on screen at hydration as it is.

## How it works

1. When the key changes, the wrapper drops to `opacity: 0` in the same commit.
2. Two `requestAnimationFrame` calls let the browser paint that hidden frame.
3. The wrapper goes back to `opacity: 1` over 0.4s.

The content is not remounted: only the wrapper's opacity changes, so state inside it survives.
With `appear={false}`, the first key skips these steps; Strict Mode's second run of the mount
effect skips them too.
