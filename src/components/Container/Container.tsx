import React from 'react';
import styles from './Container.module.scss';

export interface ContainerProps {
  children: React.ReactNode;
  narrow?: boolean;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  narrow,
  className,
  as: Tag = 'div',
}: ContainerProps) {
  const classes = [styles.container, narrow && styles.narrow, className].filter(Boolean).join(' ');
  return <Tag className={classes}>{children}</Tag>;
}
