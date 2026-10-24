import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import MarkdownEditor from './MarkdownEditor';
import type { MarkdownEditorLabels } from './MarkdownEditor';

const labels: MarkdownEditorLabels = {
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
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    quote: 'Quote',
    codeBlock: 'Code Block',
    horizontalRule: 'Horizontal Rule',
  },
  preview: 'Preview',
  sampleText: 'text',
};

function EditorWithState({ initialValue = '' }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  return <MarkdownEditor label="Description" value={value} onChange={setValue} labels={labels} />;
}

function getTextarea(): HTMLTextAreaElement {
  return screen.getByLabelText('Description');
}

describe('MarkdownEditor', () => {
  it('names the text area with its label', () => {
    render(<EditorWithState />);

    expect(getTextarea().tagName).toBe('TEXTAREA');
  });

  it('wraps the selected text in the chosen format', async () => {
    const user = userEvent.setup();
    render(<EditorWithState initialValue="hello world" />);

    getTextarea().setSelectionRange(0, 5);
    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(getTextarea()).toHaveValue('**hello** world');
  });

  it('inserts sample text when nothing is selected', async () => {
    const user = userEvent.setup();
    render(<EditorWithState />);

    await user.click(screen.getByRole('button', { name: 'Link' }));

    expect(getTextarea()).toHaveValue('[text](url)');
  });

  it('starts the current line with a block format', async () => {
    const user = userEvent.setup();
    render(<EditorWithState initialValue={'first\nsecond'} />);

    getTextarea().setSelectionRange(8, 8);
    await user.click(screen.getByRole('button', { name: 'Heading 2' }));

    expect(getTextarea()).toHaveValue('first\n## second');
  });

  it('indents with Tab instead of moving focus out of the editor', async () => {
    const user = userEvent.setup();
    render(<EditorWithState initialValue="code" />);

    await user.click(getTextarea());
    await user.keyboard('{Tab}');

    expect(getTextarea()).toHaveValue('code  ');
    expect(getTextarea()).toHaveFocus();
  });

  it('previews the rendered Markdown once there is text', async () => {
    const user = userEvent.setup();
    render(<EditorWithState />);

    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
    await user.type(getTextarea(), '## Title');

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
  });
});
