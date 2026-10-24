import { useState } from 'react';
import { MarkdownEditor } from 'react-shared-components';
import type { MarkdownEditorLabels } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';

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

const INITIAL_CONTENT = `## Project brief

Select a word and press **B**, or put the cursor on a line and press **H2**.

- Tab indents instead of leaving the field
- The preview below updates as you type`;

const CODE = `<MarkdownEditor
  label="Description"
  value={content}
  onChange={setContent}
  labels={{
    actions: { bold: 'Bold', italic: 'Italic', /* every MarkdownAction */ },
    preview: 'Preview',
    sampleText: 'text',
  }}
/>`;

export default function MarkdownEditorDemo(heading: DemoHeading) {
  const [content, setContent] = useState(INITIAL_CONTENT);

  return (
    <DemoSection
      {...heading}
      description="A Markdown text area with a formatting toolbar and a live preview. It grows with its content, and its text comes in through labels, so it speaks any language."
      code={CODE}
    >
      <MarkdownEditor
        label="Description"
        value={content}
        onChange={setContent}
        labels={EDITOR_LABELS}
        placeholder="Write in Markdown"
      />
    </DemoSection>
  );
}
