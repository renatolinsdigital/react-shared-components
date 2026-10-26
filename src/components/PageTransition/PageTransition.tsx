'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './PageTransition.module.scss';

export interface PageTransitionProps {
  children: React.ReactNode;
  /**
   * A change fades the content out and back in. Pass the current route's pathname to fade on
   * every navigation; leave it out to fade in once, on mount.
   */
  transitionKey?: string;
  /**
   * Fade the content in when the component mounts. Default: true. Pass false on a
   * server-rendered page: the first content then shows at once, in the server HTML too, and
   * only a change of `transitionKey` fades.
   */
  appear?: boolean;
}

/** Fades its content in on mount, and again whenever `transitionKey` changes. */
export default function PageTransition({
  children,
  transitionKey,
  appear = true,
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(!appear);

  // Without `appear`, the first key's content stays as it rendered. The refs, not a "first run"
  // flag, decide it: Strict Mode runs a mount effect twice, and both runs must skip.
  const keepsFirstContentRef = useRef(!appear);
  const firstKeyRef = useRef(transitionKey);

  useEffect(() => {
    if (keepsFirstContentRef.current && transitionKey === firstKeyRef.current) return;
    keepsFirstContentRef.current = false;

    // The content must hide on the same commit as the key change, before the fade-in starts
    setIsVisible(false);
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
