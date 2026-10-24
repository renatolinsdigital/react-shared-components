# MarkdownEditor

A Markdown text area with a formatting toolbar and a live preview. It grows with its content and
takes all of its text as props, so it can speak any language.

## Usage

```tsx
import { MarkdownEditor } from 'react-shared-components';
import type { MarkdownEditorLabels } from 'react-shared-components';

const EDITOR_LABELS: MarkdownEditorLabels = {
  actions: {
    bold: 'Bold',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    link: 'Link',
    image: 'Image',
    code: 'Code',
    bulletList: 'Bullet list',
    numberedList: 'Numbered list',
    quote: 'Quote',
    codeBlock: 'Code block',
    horizontalRule: 'Horizontal rule',
  },
  preview: 'Preview',
  sampleText: 'text',
};

const [content, setContent] = useState('');

<MarkdownEditor
  label="Description"
  value={content}
  onChange={setContent}
  labels={EDITOR_LABELS}
  placeholder="Write in Markdown"
/>
```

## Props

| Prop          | Type                      | Default  | Description                                        |
| ------------- | ------------------------- | -------- | -------------------------------------------------- |
| `value`       | `string`                  | required | The Markdown source. The editor is controlled.     |
| `onChange`    | `(value: string) => void` | required | Called with the whole new text on every edit.      |
| `labels`      | `MarkdownEditorLabels`    | required | The editor's own text. See below.                  |
| `label`       | `string`                  | none     | Shown above the toolbar and tied to the text area. |
| `placeholder` | `string`                  | none     | Shown while the text area is empty.                |

### `MarkdownEditorLabels`

| Field        | Type                             | Description                                                 |
| ------------ | -------------------------------- | ----------------------------------------------------------- |
| `actions`    | `Record<MarkdownAction, string>` | The tooltip and accessible name of each toolbar button.     |
| `preview`    | `string`                         | The heading over the preview.                               |
| `sampleText` | `string`                         | Inserted when a wrapping action runs with nothing selected. |

## Toolbar actions

| Action           | Button | Inserts               | Kind  |
| ---------------- | ------ | --------------------- | ----- |
| `bold`           | B      | `**text**`            | wrap  |
| `italic`         | I      | `_text_`              | wrap  |
| `strikethrough`  | S      | `~~text~~`            | wrap  |
| `heading1`       | H1     | `# `                  | block |
| `heading2`       | H2     | `## `                 | block |
| `heading3`       | H3     | `### `                | block |
| `link`           | 🔗     | `[text](url)`         | wrap  |
| `image`          | 🖼      | `![alt](text)`        | wrap  |
| `code`           | `</>`  | `` `text` ``          | wrap  |
| `bulletList`     | •      | `- `                  | block |
| `numberedList`   | 1.     | `1. `                 | block |
| `quote`          | "      | `> `                  | block |
| `codeBlock`      | `{ }`  | ` ``` ` fences        | block |
| `horizontalRule` | ―      | `---` on its own line | block |

- A **wrap** action wraps the selection, or `sampleText` when nothing is selected.
- A **block** action with nothing selected starts the current line with its prefix only. For a
  code block that is the opening fence alone. With a selection, it wraps the selection like a
  wrap action.
- After each action the cursor lands just after the inserted text.

## Behaviour

- The text area grows with its content, from a minimum of 200px. It never shows a scrollbar.
- Tab inserts two spaces instead of moving focus.
- The preview appears once there is text, rendered by [`Markdown`](../Markdown/README.md) with a
  full set of prose styles (headings, lists, quotes, code, tables, images).
- The toolbar is sticky, so it stays in reach while a long text scrolls.

## Known limitations

- Tab and Shift+Tab are both caught for indenting, so a keyboard user cannot tab out of the text
  area. They have to click elsewhere. An escape hatch (such as Esc, then Tab) is still to do.
- The toolbar sticks to `top: 0`, so under a sticky page header it slides beneath the header.
