# react-shared-components

A React 19 component library (TypeScript, SCSS modules) with a Vite demo page. The README is the
map: what each component does, how the build, the theming and the demo work.

## Rules

- `src/` knows nothing about any app: no router, no framework imports (`next/*`), no interface
  text. Text a visitor reads arrives as a prop.
- Every component has a folder with `Name.tsx`, `Name.module.scss`, `index.ts` (component and
  props type) and `README.md`. A change to props or behaviour updates the README in the same
  change, and a README never claims what the code does not do.
- A new component is exported from `src/index.ts`, gets a test, and gets a demo in
  `demo/sections/`, listed in `demo/demos.ts`. Steps: "Adding a component" in the README.
- Library code imports with relative paths: the type build does not rewrite aliases. The demo
  imports by the package name, which Vite and `tsconfig.json` point at the source.
- Components cannot count on a CSS reset: each sets the `box-sizing`, margins, borders and fonts
  it relies on. The demo page has no reset, so a missing one shows there.
- Colours come from the tokens in `src/styles/_theme.scss`; write `translucent($token, n)`,
  never `rgba($token, n)`, which breaks on `var()`. Canvases and SVG fills cannot read the
  tokens, so they take colours as props.
- No em dashes or en dashes in anything a person reads (docs, comments, demo text). Use a colon,
  a comma, brackets or two sentences. Ranges take a word: `0 to 1`.
- Tests use Vitest and React Testing Library, finding elements by role and label. A bug fix
  comes with a test that failed before it.

## Checks

`npm test`, `npm run type-check`, `npm run lint` (zero warnings) and `npm run build`. For
anything visible, run `npm run dev` and look at the demo in both themes.

## Origin

The code came from `src/shared` in the renato-lins site (`D:/projects/nextjs/renato-lins`), which
now installs this library by its release tag. The site keeps only what needs Next.js: a
`next/image` `ShimmerImage`, and a wrapper that feeds the pathname to `PageTransition`. A fix to
`ShimmerImage` probably belongs in both.

## Releasing

Apps install a release by its git tag, so a release is: the new version in `package.json` and
both root `version` fields of `package-lock.json` (`npm version x.y.z --no-git-tag-version`), the
`Unreleased` entries of `CHANGELOG.md` moved under `## [x.y.z] - YYYY-MM-DD`, a commit, and the
tag `vx.y.z` pushed with it.
