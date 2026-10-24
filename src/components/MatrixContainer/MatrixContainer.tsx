'use client';

import React, { useEffect, useRef } from 'react';
import { MATRIX_CONFIG } from './matrixConfig';
import type { MatrixConfig } from './matrixConfig';
import styles from './MatrixContainer.module.scss';

export interface MatrixContainerProps {
  /** Content rendered above the matrix canvas */
  children?: React.ReactNode;
  /**
   * Partial config override, merged over MATRIX_CONFIG at mount and then kept
   * live: later changes apply to the running animation in place, without
   * tearing down the canvas or the ResizeObserver. Pass a stable object
   * (defined outside the component or via useMemo) so unrelated parent
   * re-renders do not trigger redundant merges.
   */
  config?: Partial<MatrixConfig>;
  /**
   * CSS opacity applied to the canvas element itself (0 to 1).
   * Multiplies with the per-glyph opacity values in config.
   * Useful for dimming the entire effect without touching the config.
   * Default: 1
   */
  canvasOpacity?: number;
  /** Merged onto the wrapper element alongside the internal `.wrapper` class */
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /**
   * HTML element to render as the wrapper.
   * Use 'section', 'footer', 'aside', etc. to preserve semantic HTML.
   * Default: 'div'
   */
  as?: React.ElementType;
}

/**
 * MatrixContainer
 *
 * A wrapper element that renders the animated katakana matrix-rain canvas
 * permanently in its background. All content passed as `children` is
 * rendered on top of the canvas via a `position: relative; z-index: 1` layer.
 *
 * The canvas auto-sizes to fill the wrapper via ResizeObserver and cleans up
 * on unmount (cancelAnimationFrame + ResizeObserver.disconnect).
 *
 * @see README.md for full algorithm and config documentation.
 */
const MatrixContainer = React.forwardRef<HTMLElement, MatrixContainerProps>(
  ({ children, config, canvasOpacity = 1, className, style, id, as: Tag = 'div' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Merged once at mount, then mutated in place by the live-config effect.
    // The tick loop closes over this same object, so an update is picked up
    // on the next frame with no restart.
    const cfgRef = useRef<MatrixConfig>({ ...MATRIX_CONFIG, ...config });

    // Re-measures the canvas and re-rolls the drops. Set by the setup effect,
    // called by the live-config effect when the grid or density changes.
    const regridRef = useRef<((immediate: boolean) => void) | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cfg = cfgRef.current;

      // drops[col] = row index of the leading glyph in column col.
      // Negative values mean the stream hasn't entered the canvas yet.
      let drops: number[] = [];
      let rafId: number;
      let lastTickTime = 0;

      // Each cell is a square: column width = row height = font size
      const columnCount = () => Math.floor(canvas.width / cfg.fontSize);
      const rowCount = () => Math.floor(canvas.height / cfg.fontSize);

      // Build a fresh drops array sized to the current column count.
      // Inactive columns wait far above the canvas so streams don't all flood
      // in at once. Active columns start just above it on mount and resize, so
      // the rain arrives from the top; `immediate` (a config change) scatters
      // them across the visible height instead, so the change reads on screen
      // at once rather than trickling in over the next few seconds.
      const initDrops = (count: number, immediate: boolean) => {
        drops = Array.from({ length: count }, () => {
          const startsActive = Math.random() < cfg.columnDensity;
          if (!startsActive) return -(cfg.trailLength + Math.floor(Math.random() * rowCount() * 2));
          return immediate
            ? Math.floor(Math.random() * rowCount())
            : -Math.floor(Math.random() * rowCount());
        });
      };

      const resize = (immediate = false) => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initDrops(columnCount(), immediate);
      };
      resize();
      regridRef.current = resize;

      const ro = new ResizeObserver(() => resize());
      ro.observe(canvas);

      const tick = (timestamp: number) => {
        rafId = requestAnimationFrame(tick);

        // Throttle: only redraw once per tickMs interval
        if (timestamp - lastTickTime < cfg.tickMs) return;
        lastTickTime = timestamp;

        const cellSize = cfg.fontSize;
        const columns = columnCount();
        const canvasHeight = canvas.height;
        ctx.clearRect(0, 0, canvas.width, canvasHeight);
        ctx.font = `${cellSize}px monospace`;

        for (let col = 0; col < columns; col++) {
          const headRow = drops[col];

          // Draw the trail. trailStep 0 is the head (brightest glyph); each
          // further step sits one row higher and dimmer.
          for (let trailStep = 0; trailStep < cfg.trailLength; trailStep++) {
            const row = headRow - trailStep;
            if (row < 0 || row * cellSize > canvasHeight) continue;

            const isHead = trailStep === 0;
            const fadeRatio = 1 - trailStep / cfg.trailLength; // 1 at the head, near 0 at the tail tip
            const opacity = isHead ? cfg.headOpacity : fadeRatio * cfg.trailOpacityMax;

            const glyph = cfg.chars[Math.floor(Math.random() * cfg.chars.length)];
            ctx.fillStyle = `rgba(${cfg.color},${opacity.toFixed(3)})`;
            ctx.fillText(glyph, col * cellSize, row * cellSize);
          }

          // Advance the stream one row down
          drops[col]++;

          // Reset once the tail has fully scrolled off the bottom
          if ((headRow - cfg.trailLength) * cellSize > canvasHeight) {
            const reactivate = Math.random() < cfg.columnDensity;
            drops[col] = reactivate
              ? -Math.floor(Math.random() * cfg.trailLength) // re-enter near the top soon
              : -(cfg.trailLength + Math.floor(Math.random() * rowCount())); // pause before re-entry
          }
        }
      };

      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, []);

    // Apply config changes to the running animation instead of restarting it.
    // Merging over the defaults again means a key dropped from `config` falls
    // back to its default. On mount the merge matches cfgRef and changes nothing.
    useEffect(() => {
      const nextConfig = { ...MATRIX_CONFIG, ...config };

      // fontSize sets the grid and columnDensity is only read when a column
      // is seeded or rejoins, which for an inactive column can be many seconds
      // away. Neither shows until the drops are re-rolled, so force it.
      const needsRegrid =
        nextConfig.fontSize !== cfgRef.current.fontSize ||
        nextConfig.columnDensity !== cfgRef.current.columnDensity;

      Object.assign(cfgRef.current, nextConfig);
      if (needsRegrid) regridRef.current?.(true);
    }, [config]);

    const classes = [styles.wrapper, className].filter(Boolean).join(' ');

    return (
      <Tag ref={ref as React.Ref<HTMLElement>} className={classes} style={style} id={id}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={canvasOpacity !== 1 ? { opacity: canvasOpacity } : undefined}
        />
        <div className={styles.content}>{children}</div>
      </Tag>
    );
  },
);

MatrixContainer.displayName = 'MatrixContainer';

export default MatrixContainer;
