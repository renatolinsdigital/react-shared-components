# Changelog

What a user of the library would notice, newest first. The version follows `MAJOR.MINOR.PATCH`:
a breaking change to a component's props or exports is major, a new component or prop is minor,
a fix is a patch.

## [Unreleased]

## [1.0.0] - 2026-10-24

The first stable release. The components, props and exports of 0.1.0 are now the public API: a
change that breaks them waits for 2.0.0.

### Added

- Installing a release straight from GitHub by its tag:
  `npm install github:renatolinsdigital/react-shared-components#v1.0.0`. A `prepare` script
  builds `dist/` during the install, so the app gets the built package.

## [0.1.0] - 2026-10-24

### Added

- The library, taken from the `src/shared` folder of the renato-lins site: `Button`, `Container`,
  `LogoMark`, `Markdown`, `MarkdownEditor`, `MatrixContainer`, `OrbitalDots`, `PageHero`,
  `PageTransition`, `Section`, `Select`, `ShimmerImage`, `Tag`, `TagFilter`, `TextArea`,
  `TextInput`, `ToastProvider` with `useToast`, and the hooks `useCountUp`, `useDragReorder` and
  `useRotatingMessage`.
- A build to `dist/` (`index.js`, `styles.css`, type declarations), with the colour tokens for
  the dark and light themes inside `styles.css`.
- Every props type, and the canvas configs (`LOGO_CONFIG`, `MATRIX_CONFIG`,
  `MATRIX_THEME_CONFIG`, `ORBITAL_DOTS_CONFIG`), exported from the package root.
- A demo page with every component and hook live, in both themes.
- A README for each component, one for the hooks, and one for the library.

### Changed (from the site's copy)

- `ShimmerImage` renders a plain `<img>` instead of `next/image`, and reveals an image that
  finished loading before hydration.
- `PageTransition` takes a `transitionKey` prop instead of reading the Next.js pathname.
- Components set their own box model, margins and fonts, so they no longer need the site's CSS
  reset.

### Fixed (from the site's copy)

- The toast close button says `type="button"`, so a toast inside a form no longer submits it.
