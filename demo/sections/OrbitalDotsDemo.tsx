import { OrbitalDots } from 'react-shared-components';
import type { OrbitalDotsConfig } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import { ACCENT_RGB, useDemoTheme } from '../theme';
import demo from './demo.module.scss';

const AMBIENT_CONFIG: Partial<OrbitalDotsConfig> = {
  dotCount: 18,
  maxLineDistance: 80,
  speed: 0.2,
  lineOpacity: 0.15,
  dotOpacityMin: 0.3,
  glowBlur: 6,
  showOrbitRing: false,
  showSymbols: false,
};

const CODE = `// The config is read once, at mount: a new key remounts it with the new colour.
<OrbitalDots key={theme} config={{ color: accentRgb }}>
  <h2>Content on top</h2>
</OrbitalDots>

<OrbitalDots config={{ dotCount: 18, speed: 0.2, showSymbols: false }} />`;

export default function OrbitalDotsDemo(heading: DemoHeading) {
  const theme = useDemoTheme();
  const accentRgb = ACCENT_RGB[theme];

  return (
    <DemoSection
      {...heading}
      description="A drifting particle network behind its children: glowing dots, lines between near neighbours, a dashed orbit ring and floating code symbols. It reads its config once, at mount."
      code={CODE}
    >
      <div className={demo.grid}>
        <OrbitalDots
          key={`default-${theme}`}
          config={{ color: accentRgb }}
          className={demo.effectBox}
        >
          <div className={demo.effectContent}>
            <h4>Default</h4>
            <p>38 dots, the orbit ring and the symbols.</p>
          </div>
        </OrbitalDots>
        <OrbitalDots
          key={`ambient-${theme}`}
          config={{ ...AMBIENT_CONFIG, color: accentRgb }}
          className={demo.effectBox}
        >
          <div className={demo.effectContent}>
            <h4>Ambient</h4>
            <p>Fewer, slower dots for a quiet background.</p>
          </div>
        </OrbitalDots>
      </div>
    </DemoSection>
  );
}
