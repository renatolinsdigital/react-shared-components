import { useState } from 'react';
import { Select } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const SERVICE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'branding', label: 'Branding' },
  { value: 'motion', label: 'Motion design' },
];

const CODE = `<Select
  label="Service"
  placeholder="Select a service..."
  options={[
    { value: 'website', label: 'Website' },
    { value: 'branding', label: 'Branding' },
    { value: 'motion', label: 'Motion design' },
  ]}
  value={service}
  onChange={(event) => setService(event.target.value)}
/>`;

export default function SelectDemo(heading: DemoHeading) {
  const [service, setService] = useState('');
  const selectedLabel = SERVICE_OPTIONS.find((option) => option.value === service)?.label;

  return (
    <DemoSection
      {...heading}
      description="A labelled native select. The placeholder becomes an empty first option, so nothing is picked until the visitor picks it."
      code={CODE}
    >
      <div className={demo.stack}>
        <Select
          label="Service"
          placeholder="Select a service..."
          options={SERVICE_OPTIONS}
          value={service}
          onChange={(event) => setService(event.target.value)}
        />
        <p className={demo.caption}>Selected: {selectedLabel ?? 'nothing yet'}</p>
      </div>
    </DemoSection>
  );
}
