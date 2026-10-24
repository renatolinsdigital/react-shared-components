import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TagFilter from './TagFilter';

describe('TagFilter', () => {
  it('filters from the keyboard, starting at the chip that clears the filter', async () => {
    const onTagClick = vi.fn();
    const user = userEvent.setup();
    render(
      <TagFilter
        tags={['Motion', 'Tools']}
        activeTag={null}
        onTagClick={onTagClick}
        allLabel="All"
      />,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'All' })).toHaveFocus();
    await user.tab();
    await user.keyboard('{Enter}');

    expect(onTagClick).toHaveBeenCalledWith('Motion');
  });

  it('marks the active tag as pressed, and All when no filter is set', () => {
    const { rerender } = render(
      <TagFilter tags={['Motion']} activeTag={null} onTagClick={() => {}} allLabel="All" />,
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <TagFilter tags={['Motion']} activeTag="Motion" onTagClick={() => {}} allLabel="All" />,
    );
    expect(screen.getByRole('button', { name: 'Motion' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });
});
