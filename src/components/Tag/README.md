# Tag

A small pill label in three forms:

- **Plain**: text in a pill, nothing to click.
- **Clickable**: the whole pill is a toggle button that reports `aria-pressed`.
- **Removable**: text with its own small remove button.

A tag is clickable or removable, never both: one button cannot sit inside another. TypeScript
enforces it.

## Usage

```tsx
import { Tag } from 'react-shared-components';

<Tag label="Next.js" />

<Tag label="Motion" active={isMotionOn} onClick={toggleMotion} />

<Tag label="GSAP" active onRemove={() => removeSkill('GSAP')} removeLabel="Remove GSAP" />
```

## Props

| Prop          | Type         | Default  | Description                                                    |
| ------------- | ------------ | -------- | -------------------------------------------------------------- |
| `label`       | `string`     | required | The text.                                                      |
| `active`      | `boolean`    | `false`  | Accent fill. On a clickable tag it is also its `aria-pressed`. |
| `onClick`     | `() => void` | none     | Makes the whole tag a toggle button. Not with `onRemove`.      |
| `onRemove`    | `() => void` | none     | Adds a remove button (`×`). Not with `onClick`.                |
| `removeLabel` | `string`     | none     | The remove button's accessible name, such as `"Remove GSAP"`.  |

## Accessibility

- Both buttons say `type="button"`, so a tag inside a form never submits it.
- A clickable tag is a real `<button>`: it takes focus and answers to Enter and Space.
- Always pass `removeLabel` with `onRemove`. The button shows only `×`, so without it a screen
  reader has nothing to call it.

To filter a list with a row of tags, use [`TagFilter`](../TagFilter/README.md).
