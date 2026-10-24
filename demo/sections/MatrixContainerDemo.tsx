import { useMemo, useState } from 'react';
import { MATRIX_THEME_CONFIG, MatrixContainer } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import { useDemoTheme } from '../theme';
import demo from './demo.module.scss';

const CODE = `const config = useMemo(
  () => ({ ...MATRIX_THEME_CONFIG[theme], columnDensity, tickMs }),
  [theme, columnDensity, tickMs],
);

<MatrixContainer as="section" config={config}>
  <h2>Content sits above the rain</h2>
</MatrixContainer>`;

export default function MatrixContainerDemo(heading: DemoHeading) {
  const theme = useDemoTheme();
  const [columnDensity, setColumnDensity] = useState(0.6);
  const [tickMs, setTickMs] = useState(60);

  // Memoised so the running animation only hears about real changes
  const matrixConfig = useMemo(
    () => ({ ...MATRIX_THEME_CONFIG[theme], columnDensity, tickMs }),
    [theme, columnDensity, tickMs],
  );

  return (
    <DemoSection
      {...heading}
      description={
        <>
          Katakana rain on a canvas behind its children. A change to <code>config</code> reaches the
          running animation at once, with no restart: move the sliders.
        </>
      }
      code={CODE}
    >
      <div className={demo.stack}>
        <MatrixContainer config={matrixConfig} className={demo.effectBox}>
          <div className={demo.effectContent}>
            <h4>Content sits above the rain</h4>
            <p>The canvas fills the wrapper and resizes with it.</p>
          </div>
        </MatrixContainer>
        <div className={demo.grid}>
          <label className={demo.slider}>
            Column density: {columnDensity.toFixed(2)}
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={columnDensity}
              onChange={(event) => setColumnDensity(Number(event.target.value))}
            />
          </label>
          <label className={demo.slider}>
            Milliseconds per row: {tickMs}
            <input
              type="range"
              min={20}
              max={200}
              step={10}
              value={tickMs}
              onChange={(event) => setTickMs(Number(event.target.value))}
            />
          </label>
        </div>
      </div>
    </DemoSection>
  );
}
