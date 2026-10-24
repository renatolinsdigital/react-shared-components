'use client';

import React, { useState } from 'react';
import styles from './ShimmerImage.module.scss';

export interface ShimmerImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'onLoad'
> {
  src: string;
  /** Describes the picture. Pass an empty string for a decorative one. */
  alt: string;
}

/**
 * An `<img>` that fills its positioned parent, shows a shimmer while the file loads and fades the
 * picture in once it has decoded. `className` lands on the `<img>`.
 */
export default function ShimmerImage({ src, alt, className, ...imageProps }: ShimmerImageProps) {
  // Tracks which src loaded, not just whether one did, so a new src on a mounted component
  // shimmers again instead of popping in.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  // A cached image can finish loading before hydration attaches onLoad, and would then shimmer
  // forever. The ref sees it already complete and reveals it.
  const revealIfAlreadyLoaded = (image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) setLoadedSrc(src);
  };

  return (
    <div className={`${styles.frame} ${isLoaded ? styles.loaded : ''}`}>
      <div className={styles.shimmer} />
      <div className={styles.reveal}>
        <img
          {...imageProps}
          ref={revealIfAlreadyLoaded}
          src={src}
          alt={alt}
          className={[styles.image, className].filter(Boolean).join(' ')}
          onLoad={() => setLoadedSrc(src)}
        />
      </div>
    </div>
  );
}
