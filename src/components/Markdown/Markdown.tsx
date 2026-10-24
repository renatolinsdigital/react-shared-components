import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MarkdownProps {
  /** Markdown source. GitHub-flavoured tables and ~~strikethrough~~ are supported. */
  children: string;
  className?: string;
}

function ExternalLink({ node: _node, ...anchorProps }: ComponentPropsWithoutRef<'a'> & ExtraProps) {
  return <a {...anchorProps} target="_blank" rel="noopener noreferrer" />;
}

const MARKDOWN_COMPONENTS = { a: ExternalLink };
const REMARK_PLUGINS = [remarkGfm];

/**
 * Renders Markdown as React elements. Raw HTML in the source is shown as text and unsafe
 * link protocols such as `javascript:` are dropped, so content typed into the dashboard
 * cannot inject scripts into the page.
 */
export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={MARKDOWN_COMPONENTS}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
