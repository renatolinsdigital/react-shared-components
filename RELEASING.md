# Releasing

How a new version of react-shared-components gets from `master` to the apps that use it.

The package is not on npm. Apps install it from GitHub by a git tag, so **a release is a tag**:
a commit on `master` that sets the new version, tagged `vX.Y.Z` and pushed.

In short: checks pass on `master`, set the version with `npm version`, move the changelog entries,
point the README at the new tag, commit, tag `vX.Y.Z`, push `master`, then push the tag.

## How apps get a release

```bash
npm install github:renatolinsdigital/react-shared-components#v1.0.3
```

npm downloads the repo at that tag and runs the `prepare` script (`npm run build`) to build
`dist/`. It installs what `files` in `package.json` lists (`dist/`), plus the files
npm always includes: `package.json`, `README.md` and `LICENSE`. The app's lockfile records the
commit the tag pointed to.

Three things follow from that:

- **A change reaches an app only through a tag.** Pushing to `master` changes nothing for anyone
  until a release includes it.
- **A pushed tag never moves.** An app's lockfile pins the commit the tag had when it installed.
  If the tag later pointed elsewhere, a fresh install would build different code under the same
  version number.
- **A tag must build.** `prepare` runs on the app's machine, with the app's Node, so a tag whose
  build fails breaks every install of it.

An app can also follow a range instead of one tag: `#semver:^1.0.0` installs the newest `1.x`
tag at install time, and the lockfile pins it as usual. That works only because every tag is a
valid version: `v` followed by `MAJOR.MINOR.PATCH`.

## Choosing the version

The version follows `MAJOR.MINOR.PATCH`, judged by what an app using the library would notice.

| Bump  | When                                                 | Examples                                                                                                                                                                                   |
| ----- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Major | An app may have to change its code to upgrade.       | Removing or renaming a component, hook, export or prop. Changing a prop's type or default. Removing or renaming a CSS token (`--color-*`). Requiring a newer React major, or a newer Node. |
| Minor | Something new, and every existing use keeps working. | A new component, hook, prop, export or token. A new optional behaviour.                                                                                                                    |
| Patch | A fix or a correction, with nothing new to learn.    | A bug fix. A style fix that keeps the API. A file added to the package, as `LICENSE` was in 1.0.1.                                                                                         |

When unsure between two, take the bigger one.

Watch the Node version when upgrading a build tool. Vite, TypeScript and Sass run on the app's
machine during the install, so a new major of one of them can raise the Node version an install
needs. Update `engines` in `package.json` to match: raising it is a major release.

## When to release

- Release when `## [Unreleased]` in `CHANGELOG.md` holds something apps should get: a fix someone
  is waiting for, or a finished feature. Several changes can wait there and ship together.
- A change no app can notice never needs a release: the demo, the tests, tooling, and the docs
  that stay in the repo (this file, `CLAUDE.md`, the component READMEs). `README.md` ships inside
  the package, but a README-only change can still wait for the next release.
- Release only from `master`, with nothing uncommitted.

## When to tag

Only the release commit gets a tag, and only once the checks pass on it. Push `master` first and
the tag after it: if the push of `master` is rejected, the tag is still local and can be moved
safely (see [When something goes wrong](#when-something-goes-wrong)).

Tags are annotated (`git tag -a`), so each one records who made it and when.

## Steps

1. **Start from an up-to-date `master` and run the checks.**

   ```bash
   git switch master
   git pull
   npm ci
   npm test && npm run type-check && npm run lint && npm run format:check && npm run build
   ```

   For a visible change, also run `npm run dev` and look at the demo in both themes.

2. **Set the version** in `package.json` and in both root `version` fields of
   `package-lock.json`:

   ```bash
   npm version 1.2.0 --no-git-tag-version
   ```

   `--no-git-tag-version` stops npm from committing and tagging on its own, because the
   changelog and the README still have to join the same commit.

3. **Move the changelog entries.** In `CHANGELOG.md`, move everything under `## [Unreleased]`
   into a new heading for the version, dated today, and leave `## [Unreleased]` empty above it:

   ```md
   ## [Unreleased]

   ## [1.2.0] - 2026-11-03

   ### Added

   - `Tooltip`, a hint shown on hover and focus.
   ```

4. **Point the README at the new tag:** the install command under "Install", and the example tag
   under "Versioning".

5. **Check what will ship.**

   ```bash
   npm pack --dry-run
   ```

   The list should show the new version and hold `dist/` (`index.js`, `styles.css` and the
   `.d.ts` files), `LICENSE`, `README.md` and `package.json`.

6. **Commit, tag and push**, `master` first:

   ```bash
   git add -A
   git commit -m "release 1.2.0"
   git tag -a v1.2.0 -m "1.2.0"
   git push origin master
   git push origin v1.2.0
   ```

   Push the tag only after the push of `master` has succeeded.

7. **Install the release once, as an app would**, in an empty folder outside the repo:

   ```bash
   npm init -y
   npm install github:renatolinsdigital/react-shared-components#v1.2.0 react react-dom
   node -p "require('./node_modules/react-shared-components/package.json').version"
   ```

   It should print the new version, with `node_modules/react-shared-components/dist/` in place.

8. **Optionally, publish a GitHub release** from the tag (Releases, then "Draft a new release",
   then pick the tag), with that version's changelog section as its notes. Apps do not need it,
   but it gives people browsing the repo a readable history.

9. **Upgrade the apps** that use the library: in each, run
   `npm install github:renatolinsdigital/react-shared-components#v1.2.0`, then its own checks.

## When something goes wrong

| Situation                                     | What to do                                                                                                                                                                         |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The tag is wrong and not pushed yet           | Delete it (`git tag -d v1.2.0`), fix the commit, and tag again.                                                                                                                    |
| The push of `master` is rejected              | Someone pushed first. Run `git pull --rebase`, run the checks again, move the local tag onto the rebased commit (`git tag -fa v1.2.0 -m "1.2.0"`), then push `master` and the tag. |
| A pushed release has a bug, or does not build | Leave its tag alone. Fix the problem on `master` and release the next patch (`1.2.1`).                                                                                             |
| A pushed tag points at the wrong commit       | Leave it too. Release the next patch, and say in its changelog entry which version to skip.                                                                                        |

## Pre-releases

To let an app try a version before it is final, release it as a pre-release:
`npm version 1.2.0-beta.1 --no-git-tag-version`, tag `v1.2.0-beta.1`, and install it by that
exact tag. A range such as `#semver:^1.1.0` skips pre-releases, so no app gets one by accident.
A pre-release gets no changelog heading of its own: its entries stay under `## [Unreleased]`
until the final version ships.
