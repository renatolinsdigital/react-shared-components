import { PageHero } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `<PageHero
  eyebrow="Blog"
  title="Notes on motion"
  subtitle="Essays on animation, canvas and building for the web."
  count={12}
  countLabel="posts"
/>`;

export default function PageHeroDemo(heading: DemoHeading) {
  return (
    <DemoSection
      {...heading}
      description="The intro block of a listing page: eyebrow, title, subtitle and a counter badge. Its top padding leaves room for a fixed 72px navbar. The top of this page is one too."
      code={CODE}
    >
      <div className={demo.frame}>
        <PageHero
          eyebrow="Blog"
          title="Notes on motion"
          subtitle="Essays on animation, canvas and building for the web."
          count={12}
          countLabel="posts"
        />
      </div>
    </DemoSection>
  );
}
