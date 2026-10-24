'use client';

import React, { useEffect, useState } from 'react';
import styles from './PageTransition.module.scss';

export interface PageTransitionProps {
  children: React.ReactNode;
  /**
   * A change fades the content out and back in. Pass the current route's pathname to fade on
   * every navigation; leave it out to fade in once, on mount.
   */
  transitionKey?: string;
}

/** Fades its content in on mount, and again whenever `transitionKey` changes. */
export default function PageTransition({ children, transitionKey }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false); // eslint-disable-line react-hooks/set-state-in-effect -- the content must hide on the same commit as the key change, before the fade-in starts
    // Double rAF: let the browser paint the hidden frame first, then fade in
    let secondFrame: number;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setIsVisible(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [transitionKey]);

  return <div className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>{children}</div>;
}
