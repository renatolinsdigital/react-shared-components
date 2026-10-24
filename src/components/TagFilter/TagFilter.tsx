'use client';

import Tag from '../Tag';
import styles from './TagFilter.module.scss';

export interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
  /** The text of the chip that clears the filter, such as "All". */
  allLabel: string;
}

export default function TagFilter({ tags, activeTag, onTagClick, allLabel }: TagFilterProps) {
  return (
    <div className={styles.tagFilter}>
      <Tag label={allLabel} active={activeTag === null} onClick={() => onTagClick(null)} />
      {tags.map((tag) => (
        <Tag key={tag} label={tag} active={activeTag === tag} onClick={() => onTagClick(tag)} />
      ))}
    </div>
  );
}
