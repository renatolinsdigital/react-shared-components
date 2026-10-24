import React from 'react';
import styles from './Section.module.scss';

export interface SectionProps {
  children: React.ReactNode;
  variant?: 'dark' | 'elevated';
  noPadding?: boolean;
  className?: string;
  id?: string;
}

export default function Section({
  children,
  variant = 'dark',
  noPadding,
  className,
  id,
}: SectionProps) {
  const classes = [styles.section, styles[variant], noPadding && styles.noPadding, className]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={classes} id={id}>
      {children}
    </section>
  );
}
