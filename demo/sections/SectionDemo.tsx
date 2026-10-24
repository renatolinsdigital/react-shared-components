import { Container, Section } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `<Section>Page background, generous vertical padding</Section>
<Section variant="elevated">Raised surface</Section>
<Section variant="elevated" noPadding id="about">No padding</Section>`;

export default function SectionDemo(heading: DemoHeading) {
  return (
    <DemoSection
      {...heading}
      description={
        <>
          A page band: a <code>&lt;section&gt;</code> with vertical rhythm (4rem, 5rem from 768px)
          on the page background or a raised one.
        </>
      }
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.frame}>
          <Section>
            <Container>
              <div className={demo.frameLabel}>variant=&quot;dark&quot; (the default)</div>
            </Container>
          </Section>
        </div>
        <div className={demo.frame}>
          <Section variant="elevated">
            <Container>
              <div className={demo.frameLabel}>variant=&quot;elevated&quot;</div>
            </Container>
          </Section>
        </div>
        <div className={demo.frame}>
          <Section noPadding>
            <Container>
              <div className={demo.frameLabel}>noPadding</div>
            </Container>
          </Section>
        </div>
      </div>
    </DemoSection>
  );
}
