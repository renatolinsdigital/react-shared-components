import { useState } from 'react';
import { Tag, TagFilter } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const POSTS = [
  { title: 'Scroll-driven type', tag: 'Motion' },
  { title: 'A particle network on canvas', tag: 'Canvas' },
  { title: 'Form fields a screen reader can name', tag: 'Accessibility' },
  { title: 'Easing curves that feel right', tag: 'Motion' },
  { title: 'Matrix rain in 120 lines', tag: 'Canvas' },
];

const POST_TAGS = [...new Set(POSTS.map((post) => post.tag))];

const CODE = `const [activeTag, setActiveTag] = useState<string | null>(null);

<TagFilter
  tags={['Motion', 'Canvas', 'Accessibility']}
  activeTag={activeTag}
  onTagClick={setActiveTag}
  allLabel="All"
/>`;

export default function TagFilterDemo(heading: DemoHeading) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const visiblePosts = activeTag ? POSTS.filter((post) => post.tag === activeTag) : POSTS;

  return (
    <DemoSection
      {...heading}
      description="A row of clickable tags with a first chip that clears the filter. It holds no state: the caller keeps the active tag."
      code={CODE}
    >
      <TagFilter tags={POST_TAGS} activeTag={activeTag} onTagClick={setActiveTag} allLabel="All" />
      <ul className={demo.postList}>
        {visiblePosts.map((post) => (
          <li key={post.title} className={demo.postItem}>
            {post.title}
            <Tag label={post.tag} />
          </li>
        ))}
      </ul>
    </DemoSection>
  );
}
