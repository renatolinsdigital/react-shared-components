import { useState } from 'react';
import { TextInput } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `<TextInput label="Name" placeholder="Ada Lovelace" />

<TextInput
  label="Email"
  type="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  onBlur={() => setWasTouched(true)}
  error={wasTouched && !isValidEmail ? 'Please enter a valid email address' : undefined}
/>`;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function TextInputDemo(heading: DemoHeading) {
  const [email, setEmail] = useState('');
  const [wasTouched, setWasTouched] = useState(false);
  const isValidEmail = EMAIL_PATTERN.test(email);

  return (
    <DemoSection
      {...heading}
      description="A labelled input with an optional error line. The label is tied to the input, so screen readers announce it. Leave the email field to see the error."
      code={CODE}
    >
      <div className={demo.grid}>
        <TextInput label="Name" placeholder="Ada Lovelace" />
        <TextInput
          label="Email"
          type="email"
          placeholder="ada@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setWasTouched(true)}
          error={wasTouched && !isValidEmail ? 'Please enter a valid email address' : undefined}
        />
      </div>
    </DemoSection>
  );
}
