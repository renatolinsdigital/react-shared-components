import { useState } from 'react';
import { TextArea } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `<TextArea
  label="Message"
  placeholder="Tell me about your project"
  rows={5}
  value={message}
  onChange={(event) => setMessage(event.target.value)}
/>`;

export default function TextAreaDemo(heading: DemoHeading) {
  const [message, setMessage] = useState('');

  return (
    <DemoSection
      {...heading}
      description="A labelled, vertically resizable text area. Every textarea attribute passes through."
      code={CODE}
    >
      <div className={demo.stack}>
        <TextArea
          label="Message"
          placeholder="Tell me about your project"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <p className={demo.caption}>{message.length} characters</p>
      </div>
    </DemoSection>
  );
}
