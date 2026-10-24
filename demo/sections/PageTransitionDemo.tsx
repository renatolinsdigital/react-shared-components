import { useState } from 'react';
import { PageTransition, Tag } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `// In a Next.js layout, fade on every navigation:
const pathname = usePathname();

<PageTransition transitionKey={pathname}>{children}</PageTransition>`;

const PRETEND_PAGES = [
  { path: '/', title: 'Home', body: 'A short introduction and the latest work.' },
  { path: '/projects', title: 'Projects', body: 'Case studies, filtered by tag.' },
  { path: '/blog', title: 'Blog', body: 'Notes on motion, canvas and accessibility.' },
];

export default function PageTransitionDemo(heading: DemoHeading) {
  const [activePath, setActivePath] = useState(PRETEND_PAGES[0].path);
  const activePage = PRETEND_PAGES.find((page) => page.path === activePath) ?? PRETEND_PAGES[0];

  return (
    <DemoSection
      {...heading}
      description={
        <>
          Fades its content in on mount, and again whenever <code>transitionKey</code> changes. It
          knows nothing about routers: pass it the current pathname.
        </>
      }
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.row} role="group" aria-label="Pretend routes">
          {PRETEND_PAGES.map((page) => (
            <Tag
              key={page.path}
              label={page.title}
              active={page.path === activePath}
              onClick={() => setActivePath(page.path)}
            />
          ))}
        </div>
        <PageTransition transitionKey={activePath}>
          <div className={demo.fakePage}>
            <h4>{activePage.title}</h4>
            <p>{activePage.body}</p>
          </div>
        </PageTransition>
      </div>
    </DemoSection>
  );
}
