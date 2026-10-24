'use client';

import React, { useEffect, useRef } from 'react';
import { ORBITAL_DOTS_CONFIG } from './orbitalDotsConfig';
import type { OrbitalDotsConfig } from './orbitalDotsConfig';
import styles from './OrbitalDots.module.scss';

export interface OrbitalDotsProps {
  /** Content rendered above the canvas. */
  children?: React.ReactNode;
  /**
   * Partial config override, merged with ORBITAL_DOTS_CONFIG at mount.
   * Pass a stable reference (defined outside the component or via useMemo)
   * to avoid unnecessary remounts when the parent re-renders.
   */
  config?: Partial<OrbitalDotsConfig>;
  /**
   * CSS opacity on the <canvas> element (0 to 1).
   * Useful for dimming the entire effect without touching the config.
   * Default: 1
   */
  canvasOpacity?: number;
  /** Merged onto the wrapper element alongside the internal `.wrapper` class. */
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  /**
   * HTML element to render as the wrapper.
   * Default: 'div'
   */
  as?: React.ElementType;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface FloatingSymbol {
  text: string;
  /** Normalised position 0 to 1 (multiplied by canvas dimensions at draw time). */
  nx: number;
  ny: number;
  opacity: number;
  targetOpacity: number;
  /** Opacity step per frame towards targetOpacity. */
  fadeSpeed: number;
}

/**
 * OrbitalDots
 *
 * A wrapper element that renders an animated particle-network canvas in its
 * background: drifting glowing dots, proximity-based connector lines, an
 * optional dashed orbit ring, and floating code-syntax symbols.
 *
 * All content passed as `children` is rendered on top of the canvas via a
 * `position: relative; z-index: 1` layer.
 *
 * The canvas auto-sizes to fill the wrapper via ResizeObserver and cleans up
 * on unmount (cancelAnimationFrame + ResizeObserver.disconnect).
 *
 * @see README.md for full algorithm and config documentation.
 */
const OrbitalDots = React.forwardRef<HTMLElement, OrbitalDotsProps>(
  ({ children, config, canvasOpacity = 1, className, style, id, as: Tag = 'div' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Capture merged config once at mount. This avoids re-running the effect when
    // an inline config object is passed (new reference every render).
    const cfgRef = useRef<OrbitalDotsConfig>({ ...ORBITAL_DOTS_CONFIG, ...config });

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cfg = cfgRef.current;
      const [r, g, b] = cfg.color.split(',').map(Number);

      let dots: Dot[] = [];
      let symbols: FloatingSymbol[] = [];
      let rafId: number;
      let lastTickTime = 0;

      // ── Initialise dots scattered across the canvas ──────────────────────
      const initDots = () => {
        const w = canvas.width;
        const h = canvas.height;
        dots = Array.from({ length: cfg.dotCount }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2 * cfg.speed,
          vy: (Math.random() - 0.5) * 2 * cfg.speed,
          radius: cfg.dotMinRadius + Math.random() * (cfg.dotMaxRadius - cfg.dotMinRadius),
          opacity: cfg.dotOpacityMin + Math.random() * (1 - cfg.dotOpacityMin),
        }));
      };

      // ── Initialise floating symbols at normalised positions ───────────────
      const initSymbols = () => {
        if (!cfg.showSymbols) {
          symbols = [];
          return;
        }

        // Fixed layout, four quadrants: bottom-left, bottom-right, right, top-right.
        // These are normalised (0 to 1) so they scale with the canvas.
        const positions = [
          { nx: 0.14, ny: 0.78 },
          { nx: 0.63, ny: 0.85 },
          { nx: 0.75, ny: 0.43 },
          { nx: 0.7, ny: 0.16 },
        ];

        symbols = cfg.symbols.map((text, i) => {
          const pos = positions[i % positions.length];
          const startOpacity = 0.2 + Math.random() * 0.35;
          return {
            text,
            nx: pos.nx,
            ny: pos.ny,
            opacity: startOpacity,
            targetOpacity: 0.2 + Math.random() * 0.35,
            fadeSpeed: 0.003 + Math.random() * 0.004,
          };
        });
      };

      // ── Resize: resync canvas pixels to CSS size, reinit data ─────────────
      const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initDots();
        initSymbols();
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // ── Animation loop ─────────────────────────────────────────────────────
      const tick = (timestamp: number) => {
        rafId = requestAnimationFrame(tick);
        if (timestamp - lastTickTime < cfg.tickMs) return;
        lastTickTime = timestamp;

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // 1. Move dots, bouncing off edges
        for (const dot of dots) {
          dot.x += dot.vx;
          dot.y += dot.vy;
          if (dot.x < dot.radius || dot.x > w - dot.radius) dot.vx *= -1;
          if (dot.y < dot.radius || dot.y > h - dot.radius) dot.vy *= -1;
          // Clamp to prevent escape on resize
          dot.x = Math.max(dot.radius, Math.min(w - dot.radius, dot.x));
          dot.y = Math.max(dot.radius, Math.min(h - dot.radius, dot.y));
        }

        // 2. Draw connector lines (no shadow: a pure geometry pass)
        ctx.lineWidth = 0.6;
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cfg.maxLineDistance) {
              const alpha = (1 - dist / cfg.maxLineDistance) * cfg.lineOpacity;
              ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.stroke();
            }
          }
        }

        // 3. Orbit ring: a dashed circle at canvas centre
        if (cfg.showOrbitRing) {
          const cx = w / 2;
          const cy = h / 2;
          const ringR = Math.min(w, h) * cfg.orbitRingRadius;
          ctx.save();
          ctx.setLineDash([3, 9]);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`;
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // 4. Draw dots: set glow once for all dots, reset after
        ctx.shadowColor = `rgba(${r},${g},${b},0.55)`;
        ctx.shadowBlur = cfg.glowBlur;
        for (const dot of dots) {
          ctx.fillStyle = `rgba(${r},${g},${b},${dot.opacity.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // 5. Floating symbols: gently cross-fade between random opacities
        if (cfg.showSymbols && symbols.length > 0) {
          const fontSize = Math.max(9, Math.round(Math.min(w, h) * cfg.symbolFontScale));
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = 'center';
          for (const sym of symbols) {
            const delta = sym.targetOpacity - sym.opacity;
            if (Math.abs(delta) <= sym.fadeSpeed) {
              // Reached target, so pick a new one
              sym.opacity = sym.targetOpacity;
              sym.targetOpacity = 0.15 + Math.random() * 0.4;
            } else {
              sym.opacity += delta > 0 ? sym.fadeSpeed : -sym.fadeSpeed;
            }
            ctx.fillStyle = `rgba(${r},${g},${b},${sym.opacity.toFixed(3)})`;
            ctx.fillText(sym.text, sym.nx * w, sym.ny * h);
          }
          ctx.textAlign = 'start';
        }
      };

      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, []);

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

OrbitalDots.displayName = 'OrbitalDots';

export default OrbitalDots;
