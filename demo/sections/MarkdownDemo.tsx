import { Markdown } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const SAMPLE_MARKDOWN = `## Release notes

The **Markdown** component renders GitHub-flavoured Markdown:

- tables and ~~strikethrough~~
- \`inline code\`
- links that open in a new tab, such as [the React docs](https://react.dev)
- raw HTML shown as text, never run: <script>alert(1)</script>

| Tool | Use |
| --- | --- |
| GSAP | Motion |
| Canvas | Effects |`;

const CODE = `<Markdown className={styles.prose}>{post.content}</Markdown>`;

export default function MarkdownDemo(heading: DemoHeading) {
  return (
    <DemoSection
      {...heading}
      description={
        <>
          Renders Markdown as React elements, with GitHub tables and strikethrough. Raw HTML is
          escaped and <code>javascript:</code> links are dropped, so text typed by users is safe to
          show. It ships no typography: style the output through <code>className</code>.
        </>
      }
      code={CODE}
    >
      <Markdown className={demo.prose}>{SAMPLE_MARKDOWN}</Markdown>
    </DemoSection>
  );
}
