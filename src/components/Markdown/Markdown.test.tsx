import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Markdown from './Markdown';

describe('Markdown', () => {
  it('renders GitHub-flavoured tables and strikethrough', () => {
    const { container } = render(
      <Markdown>{'| Tool | Use |\n| --- | --- |\n| GSAP | Motion |\n\n~~old~~'}</Markdown>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'GSAP' })).toBeInTheDocument();
    expect(container.querySelector('del')).toHaveTextContent('old');
  });

  it('never turns raw HTML from the dashboard into elements', () => {
    const { container } = render(
      <Markdown>{'<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">'}</Markdown>,
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('drops a javascript: link target', () => {
    render(<Markdown>{'[click me](javascript:alert(1))'}</Markdown>);

    const link = screen.getByText('click me').closest('a');
    expect(link?.getAttribute('href') ?? '').not.toContain('javascript');
  });

  it('opens links in a new tab without handing that tab a reference back', () => {
    render(<Markdown>{'[GitHub](https://github.com/renatolinsdigital)'}</Markdown>);

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/renatolinsdigital');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
