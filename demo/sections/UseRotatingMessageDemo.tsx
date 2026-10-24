import { useRotatingMessage } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const STATUS_MESSAGES = ['Open to new projects', 'Booked from March', 'Replies within a day'];

const CODE = `const { message, isFading } = useRotatingMessage(messages, 2500);

<p className={isFading ? styles.hidden : styles.shown}>{message}</p>`;

export default function UseRotatingMessageDemo(heading: DemoHeading) {
  const { message, isFading } = useRotatingMessage(STATUS_MESSAGES, 2500);

  return (
    <DemoSection
      {...heading}
      description={
        <>
          Cycles through a list of messages on a timer. <code>isFading</code> turns true for 300ms
          before each swap, so the text can fade out and back in.
        </>
      }
      code={CODE}
    >
      <p className={`${demo.statusPill} ${isFading ? demo.fading : ''}`}>
        <span className={demo.statusDot} />
        {message}
      </p>
    </DemoSection>
  );
}
