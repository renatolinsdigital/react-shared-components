import { LogoMark } from 'react-shared-components';
import type { LogoPreset } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import { ACCENT_HEX, useDemoTheme } from '../theme';
import demo from './demo.module.scss';

const SMALL_PRESETS: LogoPreset[] = ['default', 'footer', 'minimal'];

const CODE = `<LogoMark />
<LogoMark preset="footer" />
<LogoMark preset="minimal" />
<LogoMark preset="hero" color={accentHex} />`;

export default function LogoMarkDemo(heading: DemoHeading) {
  const theme = useDemoTheme();
  const accentHex = ACCENT_HEX[theme];

  return (
    <DemoSection
      {...heading}
      description="The Renato Lins logo as animated SVG. Its four paths scatter and fly together each time it scrolls into view, a glow breathes behind it, and the hero preset adds a particle canvas that shies away from the cursor. Pass the theme's accent as color: SVG fills and canvases cannot read CSS variables."
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.logoRow}>
          {SMALL_PRESETS.map((preset) => (
            <figure key={preset} className={demo.logoCell}>
              <LogoMark preset={preset} color={accentHex} />
              <figcaption className={demo.caption}>preset=&quot;{preset}&quot;</figcaption>
            </figure>
          ))}
        </div>
        <div className={demo.heroLogo}>
          <LogoMark preset="hero" color={accentHex} />
        </div>
        <p className={demo.caption}>
          Hover the logo, or scroll it out of view and back to replay the assembly.
        </p>
      </div>
    </DemoSection>
  );
}
