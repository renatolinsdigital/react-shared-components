'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOGO_CONFIG } from './logoMarkConfig';
import styles from './LogoMark.module.scss';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ───────────────────────────────────────────────────────────────────

export type LogoPreset = 'default' | 'footer' | 'hero' | 'minimal';

export interface LogoMarkProps {
  /** Accent color hex (default: #c8ff00) */
  color?: string;
  /** Overall logo opacity, 0 to 1 (default: 0.72) */
  opacity?: number;
  /** Logo width in px; height follows the 196:282 viewBox (default: 60) */
  size?: number;
  /** Show particle-constellation canvas background (default: false) */
  showCanvas?: boolean;
  /** Pulse the glow disc behind the logo (default: true) */
  pulse?: boolean;
  /** Enable scroll-triggered path mount animation (default: true) */
  mountAnimation?: boolean;
  /** Canvas glow and ring intensity multiplier, 0 to 1 (default: 0.8) */
  glowIntensity?: number;
  /** Pulse speed multiplier (default: 1) */
  pulseSpeed?: number;
  /** Particle count, only when showCanvas=true (default: 35) */
  particleCount?: number;
  /** Convenience preset: overrides individual defaults */
  preset?: LogoPreset;
  /** Extra className on root element */
  className?: string;
}

// ─── Preset defaults ─────────────────────────────────────────────────────────

type ResolvedProps = Required<Omit<LogoMarkProps, 'className' | 'preset'>>;

// Preset config is a partial bag: only fields that differ from defaults.
type PresetConfig = Partial<Omit<ResolvedProps, 'size'>> & { sizeRatio?: number };

function resolveProps(props: LogoMarkProps): ResolvedProps {
  const presetName = props.preset ?? 'default';

  // Look up the preset (empty for 'default', which inherits the defaults).
  const pc: PresetConfig =
    presetName !== 'default' && presetName in LOGO_CONFIG.presets
      ? (LOGO_CONFIG.presets[presetName as keyof typeof LOGO_CONFIG.presets] as PresetConfig)
      : {};

  // Cascade: explicit prop > preset override > default.
  const baseSize = LOGO_CONFIG.defaults.size;
  return {
    color: props.color ?? pc.color ?? LOGO_CONFIG.defaults.color,
    opacity: props.opacity ?? pc.opacity ?? LOGO_CONFIG.defaults.opacity,
    size: props.size ?? Math.round(baseSize * (pc.sizeRatio ?? 1)),
    showCanvas: props.showCanvas ?? pc.showCanvas ?? false,
    pulse: props.pulse ?? pc.pulse ?? true,
    mountAnimation: props.mountAnimation ?? pc.mountAnimation ?? true,
    glowIntensity: props.glowIntensity ?? pc.glowIntensity ?? LOGO_CONFIG.defaults.glowIntensity,
    pulseSpeed: props.pulseSpeed ?? pc.pulseSpeed ?? 1,
    particleCount:
      props.particleCount ?? pc.particleCount ?? LOGO_CONFIG.canvas.defaultParticleCount,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const hexWithoutHash = hex.replace('#', '');
  const normalizedHex =
    hexWithoutHash.length === 3
      ? hexWithoutHash
          .split('')
          .map((hexChar) => hexChar + hexChar)
          .join('')
      : hexWithoutHash;
  const hexInt = parseInt(normalizedHex, 16);
  return { r: (hexInt >> 16) & 255, g: (hexInt >> 8) & 255, b: hexInt & 255 };
}

// ─── Canvas types ────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  alpha: number;
  size: number;
  pulse: number;
  pulseSpeed: number;
}

interface Ring {
  radius: number;
  alpha: number;
  rotation: number;
  speed: number;
  dashOffset: number;
}

// ─── SVG path data (verbatim from public/logo.svg, viewBox 0 0 196 282) ─────

const PATH_BORDER =
  'M7.222,274.412l0.191,-267.19l180.79,0.072l0,267.201l-180.98,-0.083Zm-7.026,-274.412l-0.196,281.63l195.422,0.087l0,-281.648l-195.225,-0.069Z';
const PATH_R_FILL =
  'M174.12,181.124l0,78.9l-0.168,0l-78.911,-78.911c16.228,-18.481 26.072,-42.702 26.072,-69.205c0,-38.154 -20.402,-71.58 -50.881,-89.955l81.665,0l0,159.172l22.223,0Z';
const PATH_L_CORNER =
  'M153.392,260.023l-131.377,0l0,-43.318c23.905,-1.319 45.688,-10.652 62.705,-25.355l68.673,68.673Z';
const PATH_R_CIRCLE =
  'M21.687,72.899l-0,-50.946c46.431,3.707 83.007,42.609 83.007,89.987c0,47.378 -36.576,86.281 -83.007,89.987l-0,-50.945c18.656,-3.205 32.87,-19.477 32.87,-39.042c0,-19.565 -14.214,-35.837 -32.87,-39.042Z';

// ─── Component ───────────────────────────────────────────────────────────────

export default function LogoMark(rawProps: LogoMarkProps) {
  const {
    color,
    opacity,
    size,
    showCanvas,
    pulse,
    mountAnimation,
    glowIntensity,
    pulseSpeed,
    particleCount,
  } = resolveProps(rawProps);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animRef = useRef({ progress: 0 });

  // Refs for individual SVG path groups
  const borderRef = useRef<SVGGElement>(null);
  const rFillRef = useRef<SVGGElement>(null);
  const lCornerRef = useRef<SVGGElement>(null);
  const rCircleRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgWrap = svgWrapRef.current;
    if (!container) return;

    const rgb = hexToRgb(color);

    // ── Canvas setup ─────────────────────────────────────────────────────

    const canvas = canvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    let canvasWidth = 0,
      canvasHeight = 0,
      centerX = 0,
      centerY = 0;
    let particles: Particle[] = [];
    let rings: Ring[] = [];

    if (showCanvas && canvas) {
      ctx = canvas.getContext('2d')!;

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasWidth = rect.width;
        canvasHeight = rect.height;
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        centerX = canvasWidth / 2;
        centerY = canvasHeight / 2;
      };

      const buildScene = () => {
        particles = [];
        const maxOrbit = Math.min(canvasWidth, canvasHeight) * 0.44;
        for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
          const orbitRadius = 20 + Math.random() * (maxOrbit - 20);
          const initialAngle = Math.random() * Math.PI * 2;
          particles.push({
            x: centerX + Math.cos(initialAngle) * orbitRadius,
            y: centerY + Math.sin(initialAngle) * orbitRadius,
            orbitRadius,
            orbitSpeed: (0.15 + Math.random() * 0.45) * (Math.random() > 0.5 ? 1 : -1),
            angle: initialAngle,
            alpha: 0.3 + Math.random() * 0.7,
            size: 1 + Math.random() * 2.5,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.4 + Math.random() * 1.6,
          });
        }
        const ringRadii = [0.25, 0.45, 0.68, 0.88];
        rings = ringRadii.map((radiusFraction, ringIndex) => ({
          radius: maxOrbit * radiusFraction,
          alpha: (0.2 - ringIndex * 0.03) * glowIntensity,
          rotation: 0,
          speed: (0.4 - ringIndex * 0.06) * (ringIndex % 2 === 0 ? 1 : -1),
          dashOffset: 0,
        }));
      };

      const draw = () => {
        if (!ctx) return;
        const animationProgress = animRef.current.progress;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        if (animationProgress <= 0.01) return;
        const mouse = mouseRef.current;

        // Rings
        rings.forEach((ring) => {
          ring.rotation += ring.speed * 0.006;
          ring.dashOffset += ring.speed * 0.3;
          const scaledRadius = ring.radius * animationProgress;
          ctx!.save();
          ctx!.translate(centerX, centerY);
          ctx!.rotate(ring.rotation);
          ctx!.beginPath();
          ctx!.setLineDash([3, 10]);
          ctx!.lineDashOffset = ring.dashOffset;
          ctx!.arc(0, 0, scaledRadius, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${ring.alpha * animationProgress})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
          ctx!.setLineDash([]);
          ctx!.restore();
          const nodeCount = 3;
          for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
            const nodeAngle = ring.rotation + (Math.PI * 2 * nodeIndex) / nodeCount;
            ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${ring.alpha * 2.5 * animationProgress})`;
            ctx!.beginPath();
            ctx!.arc(
              centerX + Math.cos(nodeAngle) * scaledRadius,
              centerY + Math.sin(nodeAngle) * scaledRadius,
              2,
              0,
              Math.PI * 2,
            );
            ctx!.fill();
          }
        });

        // Particles
        particles.forEach((p) => {
          p.angle += p.orbitSpeed * 0.006;
          p.pulse += p.pulseSpeed * 0.016;
          const targetX = centerX + Math.cos(p.angle) * p.orbitRadius * animationProgress;
          const targetY = centerY + Math.sin(p.angle) * p.orbitRadius * animationProgress;
          if (mouse.active) {
            const deltaX = targetX - mouse.x,
              deltaY = targetY - mouse.y;
            const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (dist < 90 && dist > 0) {
              const repelForce = (90 - dist) / 90;
              p.x = targetX + (deltaX / dist) * repelForce * 30;
              p.y = targetY + (deltaY / dist) * repelForce * 30;
            } else {
              p.x += (targetX - p.x) * 0.08;
              p.y += (targetY - p.y) * 0.08;
            }
          } else {
            p.x += (targetX - p.x) * 0.08;
            p.y += (targetY - p.y) * 0.08;
          }

          const pulseAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
          const pulseSize = p.size * (0.8 + 0.2 * Math.sin(p.pulse));
          const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 5);
          grad.addColorStop(
            0,
            `rgba(${rgb.r},${rgb.g},${rgb.b},${pulseAlpha * 0.25 * animationProgress})`,
          );
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, pulseSize * 5, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${pulseAlpha * animationProgress})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
          ctx!.fill();
        });

        // Connections
        const maxDist = Math.min(canvasWidth, canvasHeight) * 0.18;
        for (
          let outerParticleIndex = 0;
          outerParticleIndex < particles.length;
          outerParticleIndex++
        ) {
          for (
            let innerParticleIndex = outerParticleIndex + 1;
            innerParticleIndex < particles.length;
            innerParticleIndex++
          ) {
            const deltaX = particles[outerParticleIndex].x - particles[innerParticleIndex].x;
            const deltaY = particles[outerParticleIndex].y - particles[innerParticleIndex].y;
            const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (dist < maxDist) {
              ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${(1 - dist / maxDist) * 0.12 * animationProgress})`;
              ctx!.lineWidth = 0.6;
              ctx!.beginPath();
              ctx!.moveTo(particles[outerParticleIndex].x, particles[outerParticleIndex].y);
              ctx!.lineTo(particles[innerParticleIndex].x, particles[innerParticleIndex].y);
              ctx!.stroke();
            }
          }
        }

        // Center glow
        const glowRadius = 70 * animationProgress * glowIntensity;
        const centerGlowGradient = ctx!.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowRadius,
        );
        centerGlowGradient.addColorStop(
          0,
          `rgba(${rgb.r},${rgb.g},${rgb.b},${0.07 * animationProgress * glowIntensity})`,
        );
        centerGlowGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = centerGlowGradient;
        ctx!.beginPath();
        ctx!.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
        ctx!.fill();
      };

      gsap.ticker.add(draw);

      const ro = new ResizeObserver(() => {
        resize();
        buildScene();
      });
      ro.observe(container);
      resize();
      buildScene();

      // Mouse events for canvas
      const onMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.active = true;
      };
      const onLeave = () => {
        mouseRef.current.active = false;
      };
      container.addEventListener('mousemove', onMove);
      container.addEventListener('mouseleave', onLeave);

      // Cleanup canvas
      const cleanCanvas = () => {
        gsap.ticker.remove(draw);
        ro.disconnect();
        container.removeEventListener('mousemove', onMove);
        container.removeEventListener('mouseleave', onLeave);
      };

      // Store cleanup for later
      (container as HTMLElement & { _cleanCanvas?: () => void })._cleanCanvas = cleanCanvas;
    }

    // ── SVG path mount animation ─────────────────────────────────────────

    const pathEls = [
      borderRef.current,
      rFillRef.current,
      lCornerRef.current,
      rCircleRef.current,
    ].filter(Boolean) as SVGGElement[];

    // Initial hidden state
    gsap.set(pathEls, { opacity: 0 });
    if (svgWrap) gsap.set(svgWrap, { opacity: 0 });

    let canvasTween: gsap.core.Tween | null = null;
    let mountDelayCall: gsap.core.Tween | null = null;

    // The pulse breathes the glow disc behind the SVG, never the paths: a CSS
    // filter on a path rasterises it, and at footer size the logo turns to mush.
    const startGlowPulse = (delay: number) => {
      if (!pulse || !glowRef.current) return;
      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.3,
        duration: 2.5 / pulseSpeed,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });
    };

    // Scatters all paths to random positions then assembles them into the logo.
    // Called each time the component enters the visible viewport.
    const playMountAnim = () => {
      // Kill any in-flight animations (mount tweens and pulse tweens alike)
      gsap.killTweensOf(pathEls);
      if (glowRef.current) gsap.killTweensOf(glowRef.current);
      if (svgWrap) {
        gsap.killTweensOf(svgWrap);
        gsap.set(svgWrap, { opacity: 1 });
      }

      // Re-reveal canvas on each entry
      if (showCanvas) {
        if (canvasTween) canvasTween.kill();
        animRef.current.progress = 0;
        canvasTween = gsap.to(animRef.current, {
          progress: 1,
          duration: LOGO_CONFIG.canvas.revealDuration,
          ease: 'power3.out',
        });
      }

      // Scatter paths to random positions, then fly in
      const { mountAnim: m } = LOGO_CONFIG;
      let maxDur = 0;
      pathEls.forEach((el) => {
        const dur = m.durationMin + Math.random() * (m.durationMax - m.durationMin);
        const delay = Math.random() * m.delayMax;
        maxDur = Math.max(maxDur, dur + delay);
        gsap.fromTo(
          el,
          {
            x: gsap.utils.random(m.scatterX[0], m.scatterX[1]),
            y: gsap.utils.random(m.scatterY[0], m.scatterY[1]),
            rotation: gsap.utils.random(m.rotationRange[0], m.rotationRange[1]),
            scale: gsap.utils.random(m.scaleMin, m.scaleMax),
            opacity: 0,
            transformOrigin: '50% 50%',
            svgOrigin: '98 141',
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity,
            duration: dur,
            ease: m.ease,
            delay,
          },
        );
      });

      startGlowPulse(maxDur);
    };

    // Schedules playMountAnim after the configured mountDelay, cancelling any
    // previously scheduled call so rapid scroll-in/out events don't stack.
    const scheduleMount = () => {
      if (mountDelayCall) mountDelayCall.kill();
      const delay = LOGO_CONFIG.mountAnim.mountDelay;
      mountDelayCall = gsap.delayedCall(delay, playMountAnim);
    };

    // Hides all paths. Called each time the logo leaves the visible viewport.
    const resetLogo = () => {
      // Cancel any pending scheduled mount so it doesn't fire after the logo
      // has already left the viewport.
      if (mountDelayCall) {
        mountDelayCall.kill();
        mountDelayCall = null;
      }
      gsap.killTweensOf(pathEls);
      if (glowRef.current) gsap.killTweensOf(glowRef.current);
      if (svgWrap) {
        gsap.killTweensOf(svgWrap);
        gsap.set(svgWrap, { opacity: 0 });
      }
      if (canvasTween) {
        canvasTween.kill();
        canvasTween = null;
      }
      if (showCanvas) gsap.to(animRef.current, { progress: 0, duration: 0.5, ease: 'power2.in' });
      gsap.set(pathEls, { opacity: 0 });
    };

    // ScrollTrigger: fires on every entry/exit (no once:true) so the animation
    // replays whenever the logo scrolls back into view.
    let st: ScrollTrigger | null = null;
    if (mountAnimation) {
      st = ScrollTrigger.create({
        trigger: container,
        start: LOGO_CONFIG.mountAnim.scrollStart,
        onEnter: scheduleMount,
        onEnterBack: scheduleMount,
        onLeaveBack: resetLogo,
      });
      // Watch for page-height changes (async data loads on any page) and
      // re-calculate ScrollTrigger positions automatically. Also do an
      // immediate refresh after a short delay for the initial mount.
      const refreshId = setTimeout(() => ScrollTrigger.refresh(), 400);
      let bodyRO: ResizeObserver | null = null;
      if (typeof document !== 'undefined') {
        let lastH = document.body.scrollHeight;
        bodyRO = new ResizeObserver(() => {
          const h = document.body.scrollHeight;
          if (h !== lastH) {
            lastH = h;
            ScrollTrigger.refresh();
          }
        });
        bodyRO.observe(document.body);
      }
      const cleanupRefresh = () => {
        clearTimeout(refreshId);
        bodyRO?.disconnect();
      };
      (container as HTMLElement & { _cleanRefresh?: () => void })._cleanRefresh = cleanupRefresh;
    } else {
      // No scroll trigger: display immediately without animation
      if (svgWrap) gsap.set(svgWrap, { opacity: 1 });
      gsap.set(pathEls, { opacity });
      startGlowPulse(0);
    }

    // ── Hover: logo scale ────────────────────────────────────────────────

    if (svgWrap) {
      const onEnter = () => {
        gsap.to(svgWrap, { scale: 1.05, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      };
      const onHoverLeave = () => {
        gsap.to(svgWrap, { scale: 1, duration: 0.5, ease: 'power2.inOut', overwrite: 'auto' });
      };
      svgWrap.addEventListener('mouseenter', onEnter);
      svgWrap.addEventListener('mouseleave', onHoverLeave);
      (svgWrap as HTMLElement & { _cleanHover?: () => void })._cleanHover = () => {
        svgWrap.removeEventListener('mouseenter', onEnter);
        svgWrap.removeEventListener('mouseleave', onHoverLeave);
      };
    }

    const glowEl = glowRef.current;
    return () => {
      gsap.killTweensOf(pathEls);
      if (glowEl) gsap.killTweensOf(glowEl);
      if (svgWrap) gsap.killTweensOf(svgWrap);
      if (canvasTween) canvasTween.kill();
      st?.kill();
      (container as HTMLElement & { _cleanCanvas?: () => void })._cleanCanvas?.();
      (container as HTMLElement & { _cleanRefresh?: () => void })._cleanRefresh?.();
      (svgWrap as (HTMLElement & { _cleanHover?: () => void }) | null)?._cleanHover?.();
    };
  }, [
    color,
    opacity,
    size,
    showCanvas,
    pulse,
    mountAnimation,
    glowIntensity,
    pulseSpeed,
    particleCount,
  ]);

  const rgb = hexToRgb(color);
  const svgH = Math.round(size * (282 / 196));

  return (
    <div
      ref={containerRef}
      className={[styles.container, showCanvas ? styles.withCanvas : '', rawProps.className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {/* Particle canvas, only when showCanvas=true */}
      {showCanvas && <canvas ref={canvasRef} className={styles.canvas} />}

      {/* Ambient glow disc */}
      <div
        ref={glowRef}
        className={styles.glowDisc}
        style={{
          background: `radial-gradient(circle, rgba(${rgb.r},${rgb.g},${rgb.b},0.18) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},0.05) 50%, transparent 70%)`,
          opacity: 0.4,
          width: size * 1.4,
          height: size * 1.4,
        }}
      />

      {/* SVG logo */}
      <div ref={svgWrapRef} className={styles.svgWrap} style={{ width: size, height: svgH }}>
        <svg
          viewBox="0 0 196 282"
          width={size}
          height={svgH}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Renato Lins logo"
          className={styles.svg}
        >
          {/* Border frame */}
          <g ref={borderRef} className={styles.logoPath}>
            <path d={PATH_BORDER} style={{ fill: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})` }} />
          </g>

          {/* R fill / diagonal body */}
          <g ref={rFillRef} className={styles.logoPath}>
            <path d={PATH_R_FILL} style={{ fill: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})` }} />
          </g>

          {/* L corner / bottom triangle */}
          <g ref={lCornerRef} className={styles.logoPath}>
            <path
              d={PATH_L_CORNER}
              style={{ fill: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})` }}
            />
          </g>

          {/* R arc / circle element */}
          <g ref={rCircleRef} className={styles.logoPath}>
            <path
              d={PATH_R_CIRCLE}
              style={{ fill: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})` }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
