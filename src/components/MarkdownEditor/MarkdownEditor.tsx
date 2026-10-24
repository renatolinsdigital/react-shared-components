'use client';

import React, { useCallback, useEffect, useId, useRef } from 'react';
import Markdown from '../Markdown';
import styles from './MarkdownEditor.module.scss';

export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'link'
  | 'image'
  | 'code'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'codeBlock'
  | 'horizontalRule';

/** The editor's own text, so the caller can give it in the page's language. */
export interface MarkdownEditorLabels {
  /** The tooltip and accessible name of each toolbar button. */
  actions: Record<MarkdownAction, string>;
  preview: string;
  /** Inserted when a wrapping action (bold, link) runs with nothing selected. */
  sampleText: string;
}

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  labels: MarkdownEditorLabels;
  label?: string;
  placeholder?: string;
}

type FormatAction = {
  action: MarkdownAction;
  icon: string;
  prefix: string;
  suffix: string;
  /** Block actions with no selection insert the prefix at the start of the current line. */
  block?: boolean;
};

const MIN_TEXTAREA_HEIGHT_PX = 200;
const TAB_INDENT = '  ';

// Toolbar groups, rendered with a separator between each group
const TOOLBAR_GROUPS: FormatAction[][] = [
  [
    { action: 'bold', icon: 'B', prefix: '**', suffix: '**' },
    { action: 'italic', icon: 'I', prefix: '_', suffix: '_' },
    { action: 'strikethrough', icon: 'S', prefix: '~~', suffix: '~~' },
  ],
  [
    { action: 'heading1', icon: 'H1', prefix: '# ', suffix: '', block: true },
    { action: 'heading2', icon: 'H2', prefix: '## ', suffix: '', block: true },
    { action: 'heading3', icon: 'H3', prefix: '### ', suffix: '', block: true },
  ],
  [
    { action: 'link', icon: '🔗', prefix: '[', suffix: '](url)' },
    { action: 'image', icon: '🖼', prefix: '![alt](', suffix: ')' },
    { action: 'code', icon: '</>', prefix: '`', suffix: '`' },
    { action: 'bulletList', icon: '•', prefix: '- ', suffix: '', block: true },
    { action: 'numberedList', icon: '1.', prefix: '1. ', suffix: '', block: true },
    { action: 'quote', icon: '"', prefix: '> ', suffix: '', block: true },
    { action: 'codeBlock', icon: '{ }', prefix: '```\n', suffix: '\n```', block: true },
    { action: 'horizontalRule', icon: '―', prefix: '\n---\n', suffix: '', block: true },
  ],
];

export default function MarkdownEditor({
  value,
  onChange,
  labels,
  label,
  placeholder,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();

  // Grow the textarea with its content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(MIN_TEXTAREA_HEIGHT_PX, textarea.scrollHeight)}px`;
  }, [value]);

  /**
   * Applies an edit based on the current selection. `buildValue` returns the new text and the
   * position to put the cursor at.
   */
  const replaceSelection = useCallback(
    (buildValue: (selectionStart: number, selectionEnd: number) => [string, number]) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const [nextValue, cursorPosition] = buildValue(
        textarea.selectionStart,
        textarea.selectionEnd,
      );
      onChange(nextValue);
      // Wait for React to write the new value before moving the cursor
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      });
    },
    [onChange],
  );

  const applyFormat = (action: FormatAction) =>
    replaceSelection((selectionStart, selectionEnd) => {
      const selectedText = value.substring(selectionStart, selectionEnd);

      if (action.block && !selectedText) {
        const lineStart = value.substring(0, selectionStart).lastIndexOf('\n') + 1;
        return [
          value.substring(0, lineStart) + action.prefix + value.substring(lineStart),
          lineStart + action.prefix.length,
        ];
      }

      const wrappedText = selectedText || labels.sampleText;
      return [
        value.substring(0, selectionStart) +
          action.prefix +
          wrappedText +
          action.suffix +
          value.substring(selectionEnd),
        selectionStart + action.prefix.length + wrappedText.length,
      ];
    });

  // Tab inserts an indent instead of moving focus out of the editor
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    replaceSelection((selectionStart, selectionEnd) => [
      value.substring(0, selectionStart) + TAB_INDENT + value.substring(selectionEnd),
      selectionStart + TAB_INDENT.length,
    ]);
  };

  return (
    <div className={styles.editor}>
      {label && (
        <label className={styles.label} htmlFor={textareaId}>
          {label}
        </label>
      )}

      <div className={styles.toolbar}>
        {TOOLBAR_GROUPS.map((actions, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <div className={styles.separator} />}
            {actions.map((action) => (
              <button
                key={action.action}
                className={styles.toolBtn}
                onClick={() => applyFormat(action)}
                title={labels.actions[action.action]}
                aria-label={labels.actions[action.action]}
                type="button"
              >
                {action.icon}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.content}>
        <textarea
          id={textareaId}
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>

      {value.trim() && (
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <span className={styles.previewDot} />
            {labels.preview}
          </div>
          <Markdown className={styles.preview}>{value}</Markdown>
        </div>
      )}
    </div>
  );
}
