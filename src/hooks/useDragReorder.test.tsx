import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDragReorder } from './useDragReorder';

function ReorderableList({
  items,
  onReorder,
}: {
  items: string[];
  onReorder: (reorderedItems: string[]) => void;
}) {
  const { getItemProps } = useDragReorder(items, onReorder);
  return (
    <ul>
      {items.map((item, itemIndex) => (
        <li key={item} {...getItemProps(itemIndex)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function dragOnto(draggedText: string, targetText: string) {
  const dataTransfer = { effectAllowed: '', dropEffect: '' };
  fireEvent.dragStart(screen.getByText(draggedText), { dataTransfer });
  fireEvent.dragOver(screen.getByText(targetText), { dataTransfer });
  fireEvent.drop(screen.getByText(targetText), { dataTransfer });
}

describe('useDragReorder', () => {
  it('moves the dragged item to where it was dropped', () => {
    const onReorder = vi.fn();
    render(<ReorderableList items={['first', 'second', 'third']} onReorder={onReorder} />);

    dragOnto('first', 'third');

    expect(onReorder).toHaveBeenCalledWith(['second', 'third', 'first']);
  });

  it('moves an item up the list as well', () => {
    const onReorder = vi.fn();
    render(<ReorderableList items={['first', 'second', 'third']} onReorder={onReorder} />);

    dragOnto('third', 'first');

    expect(onReorder).toHaveBeenCalledWith(['third', 'first', 'second']);
  });

  it('does nothing when an item is dropped on itself', () => {
    const onReorder = vi.fn();
    render(<ReorderableList items={['first', 'second']} onReorder={onReorder} />);

    dragOnto('first', 'first');

    expect(onReorder).not.toHaveBeenCalled();
  });
});
