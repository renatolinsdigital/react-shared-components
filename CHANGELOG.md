# Changelog

What a user of the library would notice, newest first. The version follows `MAJOR.MINOR.PATCH`:
a breaking change to a component's props or exports is major, a new component or prop is minor,
a fix is a patch.

## [Unreleased]

## [1.1.0] - 2026-10-26

### Added

- `appear` on `PageTransition`. Pass `appear={false}` on a server-rendered page, and the first
  page shows in the server HTML instead of staying blank until the scripts hydrate it; later
  changes of `transitionKey` still fade. The default, `true`, keeps the fade on mount.

## [1.0.3] - 2026-10-24

### Removed

- `useCountUp`, the last part of the library that ran on GSAP. An app that imported it breaks on
  upgrade: stay on 1.0.2, or keep a copy of the hook (it is about twenty lines). Released as a
  patch by choice, as 1.0.2 was, although removing an export would call for a major.
- GSAP as a peer dependency. Apps no longer need to install it for this library.

## [1.0.2] - 2026-10-24

### Removed

- `LogoMark`, with `LOGO_CONFIG` and the types `LogoConfig`, `LogoMarkProps` and `LogoPreset`. It
  drew the Renato Lins logo, which belongs to that site rather than to a shared library. An app
  that imported any of them breaks on upgrade: stay on 1.0.1, or keep a copy of the component.
  Released as a patch by choice, although removing exports would call for a major.
- `LOGO.md`. With the logo gone, everything in the repo is under the MIT license, and the demo
  page has a neutral favicon.

## [1.0.1] - 2026-10-24

### Added

- The MIT license (`LICENSE`), inside the installed package. The Renato Lins logo artwork that
  `LogoMark` draws is left out of it, as `LOGO.md` (also in the package) says. The repo is
  public, so installing from GitHub needs no access to it.
- The package states the Node versions its install-time build needs: 20.19, or 22.12 or later.

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
