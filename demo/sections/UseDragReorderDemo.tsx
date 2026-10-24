import { useState } from 'react';
import { useDragReorder } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const INITIAL_TASKS = [
  'Sketch the layout',
  'Pick the type scale',
  'Build the components',
  'Write the READMEs',
  'Ship the demo',
];

const CODE = `const { draggedIndex, overIndex, getItemProps } = useDragReorder(tasks, setTasks);

<ol>
  {tasks.map((task, taskIndex) => (
    <li key={task} {...getItemProps(taskIndex)}>{task}</li>
  ))}
</ol>`;

export default function UseDragReorderDemo(heading: DemoHeading) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const { draggedIndex, overIndex, getItemProps } = useDragReorder(tasks, setTasks);

  return (
    <DemoSection
      {...heading}
      description="Drag-and-drop reordering for a list, on native HTML5 drag events. Spread its props onto each row; draggedIndex and overIndex are there for styling. It needs a mouse: there is no keyboard reordering yet."
      code={CODE}
    >
      <ol className={demo.reorderList}>
        {tasks.map((task, taskIndex) => (
          <li
            key={task}
            {...getItemProps(taskIndex)}
            className={[
              demo.reorderItem,
              draggedIndex === taskIndex && demo.dragging,
              overIndex === taskIndex && demo.dropTarget,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className={demo.dragHandle} aria-hidden="true">
              ⠿
            </span>
            {task}
          </li>
        ))}
      </ol>
    </DemoSection>
  );
}
