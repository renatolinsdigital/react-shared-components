# Hooks

Two small hooks with no UI of their own. Each one is exported from the package root.

```ts
import { useDragReorder, useRotatingMessage } from 'react-shared-components';
```

---

## useDragReorder

Drag-and-drop reordering for a list, on native HTML5 drag events. No library, no wrapper
elements: spread its props onto each row.

```tsx
const [tasks, setTasks] = useState(['Sketch', 'Build', 'Ship']);
const { draggedIndex, overIndex, getItemProps } = useDragReorder(tasks, setTasks);

<ol>
  {tasks.map((task, taskIndex) => (
    <li
      key={task}
      {...getItemProps(taskIndex)}
      className={overIndex === taskIndex ? styles.dropTarget : undefined}
    >
      {task}
    </li>
  ))}
</ol>
```

| Argument    | Type                               | Description                                             |
| ----------- | ---------------------------------- | ------------------------------------------------------- |
| `items`     | `Item[]`                           | The list as it is now.                                  |
| `onReorder` | `(reorderedItems: Item[]) => void` | Called after a drop, with the items in their new order. |

Returns:

| Field          | Type                       | Description                                           |
| -------------- | -------------------------- | ----------------------------------------------------- |
| `getItemProps` | `(index: number) => props` | `draggable` and the four drag handlers, for each row. |
| `draggedIndex` | `number \| null`           | The row being dragged, for styling.                   |
| `overIndex`    | `number \| null`           | The row the drag hovers over, for styling.            |

- Dropping a row on itself does nothing and does not call `onReorder`.
- The hook never mutates `items`: it hands `onReorder` a new array.

**Known limitations:** HTML5 drag events need a mouse. There is no keyboard reordering, and most
touch screens do not fire these events. Offer another way to reorder (up and down buttons) where
that matters.

---

## useRotatingMessage

Cycles through a list of messages on a timer, with a moment to fade each one out before the
next appears. Made for status lines such as "Open to new projects".

```tsx
const { message, isFading } = useRotatingMessage(statusMessages, 5000);

<p className={isFading ? styles.hidden : styles.shown}>{message}</p>
```

```scss
.shown,
.hidden {
  transition: opacity 300ms ease;
}

.hidden {
  opacity: 0;
}
```

| Argument     | Type       | Default  | Description                         |
| ------------ | ---------- | -------- | ----------------------------------- |
| `messages`   | `string[]` | required | The messages, in order.             |
| `intervalMs` | `number`   | `10000`  | Time between one swap and the next. |

Returns `{ message, isFading }`:

- `message` is the current message, or `''` for an empty list.
- `isFading` turns true 300ms before each swap and false as the next message arrives. Match the
  fade in your CSS to those 300ms.

Behaviour:

- A list of one message stays still: no timer runs.
- After the last message it wraps around to the first.
- If the list shrinks below the current position, the position wraps around the shorter list, so
  it never shows nothing.
