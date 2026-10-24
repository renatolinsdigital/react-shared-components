import { Container } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `<Container>Up to 1400px wide, centred, 2rem side padding</Container>
<Container narrow>Up to 900px wide</Container>
<Container as="article" narrow>Renders an <article></Container>`;

export default function ContainerDemo(heading: DemoHeading) {
  return (
    <DemoSection
      {...heading}
      description={
        <>
          Centres content and caps its width. <code>narrow</code> suits reading text;{' '}
          <code>as</code> picks the element.
        </>
      }
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.frame}>
          <Container>
            <div className={demo.frameLabel}>Container: up to 1400px wide</div>
          </Container>
        </div>
        <div className={demo.frame}>
          <Container narrow>
            <div className={demo.frameLabel}>Container narrow: up to 900px wide</div>
          </Container>
        </div>
      </div>
    </DemoSection>
  );
}
