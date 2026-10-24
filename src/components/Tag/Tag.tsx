'use client';

import styles from './Tag.module.scss';

interface TagBaseProps {
  label: string;
  active?: boolean;
}

/** A tag is pressed as a whole or removed with its own button, never both: buttons cannot nest. */
export type TagProps = TagBaseProps &
  (
    | { onClick: () => void; onRemove?: never; removeLabel?: never }
    | {
        onClick?: never;
        onRemove?: () => void;
        /** The accessible name of the remove button, such as "Remove Branding". */
        removeLabel?: string;
      }
  );

export default function Tag({ label, active, onClick, onRemove, removeLabel }: TagProps) {
  const classes = [
    styles.tag,
    onClick && styles.clickable,
    active && styles.active,
    onRemove && styles.removable,
  ]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-pressed={Boolean(active)}>
        {label}
      </button>
    );
  }

  return (
    <span className={classes}>
      {label}
      {onRemove && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label={removeLabel}
        >
          ×
        </button>
      )}
    </span>
  );
}
