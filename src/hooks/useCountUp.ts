import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

/** Animates a displayed number from 0 up to `target`, restarting whenever the target changes. */
export function useCountUp(target: number, durationSeconds = 1.2): number {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: target,
      duration: durationSeconds,
      ease: 'power2.out',
      onUpdate: () => setDisplayedValue(Math.round(counter.value)),
    });
    return () => {
      tween.kill();
    };
  }, [target, durationSeconds]);

  return displayedValue;
}
