# React Shared Components

React 19 components and hooks for building a site and its admin screens: form fields, layout,
tags, Markdown, toasts and canvas effects. They know nothing about the app around them, come in
dark and light themes, take every visible word as a prop, and ship with TypeScript types.

- **Themeable.** Colours are CSS custom properties: switch to light with one attribute, or
  override any token.
- **Any language.** No component holds interface text. Labels arrive as props.
- **Accessible.** Every field is tied to its label, everything clickable is a real `<button>`,
  and toggles carry `aria-pressed`.
- **One stylesheet, no reset.** Each component sets the box model, margins and fonts it relies
  on, so it looks right in an app with no CSS reset.
- **Plain React or Next.js.** One ES module with `'use client'` at the top, so it works in a Vite
  app and in the Next.js App Router alike.

## Install

The package is not on npm. Install a release from GitHub by its tag, together with GSAP, which
the app provides:

```bash
npm install github:renatolinsdigital/react-shared-components#v1.0.1 gsap
```

npm downloads the repo at that tag and builds it during the install, so the first install takes
a little longer. The app's lockfile then pins the tag's commit, and every later install gets the
same build. To upgrade, install a newer tag the same way: [CHANGELOG.md](CHANGELOG.md) lists the
releases.

### Requirements

| What                           | Version                  | Why                                                  |
| ------------------------------ | ------------------------ | ---------------------------------------------------- |
| `react`, `react-dom`           | 19                       | Peer dependencies.                                   |
| `gsap`                         | 3                        | Peer dependency, for `LogoMark` and `useCountUp`.    |
| Node.js                        | 20.19, or 22.12 or later | npm builds the package with Vite during the install. |
| `react-markdown`, `remark-gfm` | 10, 4                    | Installed with the package, for `Markdown`.          |

## Quick start

Import the stylesheet once, at the root of the app, then use the components anywhere below it:

```tsx
import 'react-shared-components/styles.css';
import { Button, TextInput, ToastProvider, useToast } from 'react-shared-components';

function NewsletterForm() {
  const { addToast } = useToast();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addToast('You are subscribed.');
      }}
    >
      <TextInput label="Email" type="email" required />
      <Button type="submit">Subscribe</Button>
    </form>
  );
}

export default function App() {
  return (
    <ToastProvider dismissLabel="Dismiss notification">
      <NewsletterForm />
    </ToastProvider>
  );
}
```

Every props type is exported as well: `import type { ButtonProps } from 'react-shared-components'`.

## Components

Each component has a README beside its code, with every prop and an example.

### Layout

| Component                                                 | What it does                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| [Container](src/components/Container/README.md)           | Centres content and caps its width (1400px, or 900px when narrow). |
| [Section](src/components/Section/README.md)               | A full-width page band with vertical rhythm.                       |
| [PageHero](src/components/PageHero/README.md)             | The intro block of a listing page, with a counter badge.           |
| [PageTransition](src/components/PageTransition/README.md) | Fades content in whenever a key (the route) changes.               |

### Forms

| Component                                       | What it does                                        |
| ----------------------------------------------- | --------------------------------------------------- |
| [Button](src/components/Button/README.md)       | A pill button in four variants and three sizes.     |
| [TextInput](src/components/TextInput/README.md) | A labelled input with an error message.             |
| [TextArea](src/components/TextArea/README.md)   | A labelled, vertically resizable text area.         |
| [Select](src/components/Select/README.md)       | A labelled native select with a placeholder option. |

### Tags

| Component                                       | What it does                                           |
| ----------------------------------------------- | ------------------------------------------------------ |
| [Tag](src/components/Tag/README.md)             | A pill label: plain, a toggle button, or removable.    |
| [TagFilter](src/components/TagFilter/README.md) | A row of tags that filters a list, with an "All" chip. |

### Content

| Component                                                 | What it does                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| [Markdown](src/components/Markdown/README.md)             | Renders Markdown safely, with GitHub tables and strikethrough. |
| [MarkdownEditor](src/components/MarkdownEditor/README.md) | A Markdown text area with a toolbar and a live preview.        |
| [ShimmerImage](src/components/ShimmerImage/README.md)     | An image that shimmers while loading, then fades in.           |

### Feedback

| Component                               | What it does                                                    |
| --------------------------------------- | --------------------------------------------------------------- |
| [Toast](src/components/Toast/README.md) | `ToastProvider` and `useToast()`: stacked, timed notifications. |

### Canvas effects

| Component                                                   | What it does                                                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [LogoMark](src/components/LogoMark/README.md)               | The animated Renato Lins logo, with an optional particle canvas. See [License](#license). |
| [MatrixContainer](src/components/MatrixContainer/README.md) | Katakana rain behind its children, tunable live.                                          |
| [OrbitalDots](src/components/OrbitalDots/README.md)         | A drifting particle network behind its children.                                          |

### Hooks

All three are documented in [src/hooks/README.md](src/hooks/README.md).

| Hook                 | What it does                                               |
| -------------------- | ---------------------------------------------------------- |
| `useCountUp`         | Counts a number up from 0 to a target.                     |
| `useDragReorder`     | Drag-and-drop reordering for a list, on HTML5 drag events. |
| `useRotatingMessage` | Cycles through messages on a timer, with a fade.           |

## Theming

`styles.css` declares the colour tokens as CSS custom properties. Dark is the default; put
`data-theme="light"` on `<html>` (or on any element, for that subtree) to switch to light:

```ts
document.documentElement.dataset.theme = 'light';
```

To change a colour, override its token after the import:

```css
:root {
  --color-accent: #ff4466;
}
```

| Token                                                                                      | Used for       |
| ------------------------------------------------------------------------------------------ | -------------- |
| `--color-bg`, `--color-bg-elevated`, `--color-bg-card`, `--color-bg-input`                 | Surfaces       |
| `--color-border`, `--color-border-hover`                                                   | Borders        |
| `--color-text`, `--color-text-secondary`, `--color-text-muted`                             | Text           |
| `--color-accent`, `--color-accent-hover`, `--color-accent-dim`, `--color-accent-secondary` | Accent         |
| `--color-danger`, `--color-success`, `--color-warning`, `--color-info`                     | Status colours |

The full palettes live in [src/styles/\_theme.scss](src/styles/_theme.scss).

Canvases and SVG fills cannot read CSS variables. `LogoMark`, `MatrixContainer` and `OrbitalDots`
take their colour as a prop or config value: pass the accent of the active theme (the demo does,
in [demo/theme.ts](demo/theme.ts)).

### Fonts

The components name three fonts and fall back to system fonts without them. Load them in the app:

- **Inter** for body text,
- **Space Grotesk** for headings,
- **JetBrains Mono** for labels and code.

## Text and language

No component holds a word of interface text. Anything a visitor reads arrives as a prop:
`Select`'s `placeholder`, `TagFilter`'s `allLabel`, `Tag`'s `removeLabel`, `ToastProvider`'s
`dismissLabel`, `MarkdownEditor`'s `labels`. Pass them in the page's language.

## Next.js

The bundle starts with `'use client'`, so every component is a client component and can be
rendered from Server Components in the App Router. Import `styles.css` in the root
`app/layout.tsx`.

Two components are plain React where Next.js has its own tools:

- `PageTransition` fades in when its `transitionKey` changes. To fade on every navigation, hand
  it the pathname from a small client component:

  ```tsx
  'use client';

  import type { ReactNode } from 'react';
  import { usePathname } from 'next/navigation';
  import { PageTransition } from 'react-shared-components';

  export default function RouteTransition({ children }: { children: ReactNode }) {
    return <PageTransition transitionKey={usePathname()}>{children}</PageTransition>;
  }
  ```

- `ShimmerImage` is a plain `<img>`, so it skips the `next/image` optimizer. Pass `srcSet` and
  `sizes` when responsive images matter; its README has more.

## Try the demo

```bash
git clone https://github.com/renatolinsdigital/react-shared-components.git
cd react-shared-components
npm install
npm run dev                    # http://localhost:5173
```

The demo page shows every component and hook working, with the code for each, and a button to
switch between the dark and light themes.

## Versioning

Releases follow `MAJOR.MINOR.PATCH`: a breaking change to a component's props or exports is
major, a new component or prop is minor, a fix is a patch. Each release is a git tag (`v1.0.1`),
with its notes in [CHANGELOG.md](CHANGELOG.md). [RELEASING.md](RELEASING.md) explains how a
release is made and when to tag one.

## Contributing

Bug reports and pull requests are welcome on GitHub.

| Command              | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `npm run dev`        | The demo page at http://localhost:5173, with hot reload.      |
| `npm run build`      | The library into `dist/`: `index.js`, `styles.css` and types. |
| `npm run build:demo` | The demo as a static site in `demo-dist/`.                    |
| `npm run preview`    | Serves the built demo.                                        |
| `npm test`           | The Vitest suite (React Testing Library, jsdom).              |
| `npm run type-check` | TypeScript, over the library and the demo.                    |
| `npm run lint`       | ESLint with Prettier, zero warnings allowed.                  |
| `npm run format`     | Formats everything with Prettier.                             |

### Layout of the repo

```
src/
  components/<Name>/   Name.tsx, Name.module.scss, index.ts, README.md, Name.test.tsx
  hooks/               the three hooks, their tests and their README
  styles/              _theme.scss (tokens), _mixins.scss, tokens.scss (the CSS variables)
  index.ts             the public API
  bundleEntry.ts       the build entry: the API plus the tokens
demo/
  App.tsx              the page: top bar, sidebar, one section per demo
  demos.ts             the list of demos, which drives the page and the sidebar
  sections/            one demo per component and hook
```

SCSS modules start with `@use 'theme' as *;` and `@use 'mixins' as *;`: Vite resolves the short
names from `src/styles`.

### Adding a component

1. A folder in `src/components/<Name>/` with `Name.tsx`, `Name.module.scss`, an `index.ts` that
   exports it and its props type, and a `README.md`.
2. Its exports in `src/index.ts`.
3. A test beside it, `Name.test.tsx`, finding elements by role and label.
4. A demo in `demo/sections/<Name>Demo.tsx`, listed in `demo/demos.ts`.
5. A row in the tables above, and a line in `CHANGELOG.md`.

### Trying a change in an app

Install a packed copy of your working folder rather than linking it. A linked folder brings its
own `node_modules/react`, and hooks then fail with "Invalid hook call".

```bash
# in this repo
npm pack                       # builds, then writes react-shared-components-<version>.tgz

# in the app
npm install ../react-shared-components/react-shared-components-<version>.tgz
```

## License

[MIT](LICENSE), except the logo artwork. `LogoMark` draws the personal mark of Renato Lins, which
the license does not cover: it may not be used as a logo for anyone or anything else
([LOGO.md](LOGO.md) has the details). The component's code is covered, so a copy can swap in
other path data and animate a different mark. Both files ship inside the installed package.
