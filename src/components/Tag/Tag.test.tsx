import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Tag from './Tag';

describe('Tag', () => {
  it('can be reached and pressed from the keyboard when it is clickable', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Tag label="Motion" onClick={onClick} />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Motion' })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('says whether it is selected', () => {
    render(
      <>
        <Tag label="Motion" active onClick={() => {}} />
        <Tag label="Branding" onClick={() => {}} />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Motion' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Branding' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('is plain text when nothing happens on a click', () => {
    render(<Tag label="Motion" />);

    expect(screen.getByText('Motion')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('removes itself without submitting the form it sits in', async () => {
    const onRemove = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const user = userEvent.setup();
    render(
      <form onSubmit={onSubmit}>
        <Tag label="Motion" active onRemove={onRemove} removeLabel="Remove Motion" />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Remove Motion' }));

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
