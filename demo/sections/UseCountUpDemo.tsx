import { useState } from 'react';
import { Button, useCountUp } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const STATS = [
  { label: 'Projects', value: 48 },
  { label: 'Commits', value: 1260 },
  { label: 'Coffees', value: 312 },
];

const CODE = `function Stat({ label, value }) {
  const displayedValue = useCountUp(value); // 1.2 seconds by default
  return <span>{displayedValue} {label}</span>;
}`;

function StatCounter({ label, target }: { label: string; target: number }) {
  const displayedValue = useCountUp(target);

  return (
    <div className={demo.stat}>
      <span className={demo.statValue}>{displayedValue}</span>
      <span className={demo.caption}>{label}</span>
    </div>
  );
}

export default function UseCountUpDemo(heading: DemoHeading) {
  const [targetMultiplier, setTargetMultiplier] = useState(1);

  return (
    <DemoSection
      {...heading}
      description="Counts a displayed number up from zero to its target with GSAP, and counts again whenever the target changes."
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.row}>
          {STATS.map((stat) => (
            <StatCounter
              key={stat.label}
              label={stat.label}
              target={stat.value * targetMultiplier}
            />
          ))}
        </div>
        <div>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setTargetMultiplier((multiplier) => (multiplier === 1 ? 2 : 1))}
          >
            Change the targets
          </Button>
        </div>
      </div>
    </DemoSection>
  );
}
