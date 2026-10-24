import { useState } from 'react';
import type { DragEvent } from 'react';

/**
 * Drag-and-drop reordering for a list, using native HTML5 drag events.
 * Spread `getItemProps(index)` onto each row. `onReorder` receives the items in their new
 * order after a drop; `draggedIndex` and `overIndex` are there for styling the rows.
 */
export function useDragReorder<Item>(items: Item[], onReorder: (reorderedItems: Item[]) => void) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const resetDrag = () => {
    setDraggedIndex(null);
    setOverIndex(null);
  };

  const getItemProps = (index: number) => ({
    draggable: true,
    onDragStart: (event: DragEvent<HTMLElement>) => {
      event.dataTransfer.effectAllowed = 'move';
      setDraggedIndex(index);
    },
    onDragOver: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      if (draggedIndex !== null && draggedIndex !== index) setOverIndex(index);
    },
    onDragEnd: resetDrag,
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        const reorderedItems = [...items];
        const [movedItem] = reorderedItems.splice(draggedIndex, 1);
        reorderedItems.splice(index, 0, movedItem);
        onReorder(reorderedItems);
      }
      resetDrag();
    },
  });

  return { draggedIndex, overIndex, getItemProps };
}
