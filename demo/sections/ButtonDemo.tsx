import { Button } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `<Button>Save project</Button>
<Button variant="secondary">Preview</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>

<Button size="small">Small</Button>
<Button size="large">Large</Button>
<Button fullWidth type="submit">Send message</Button>`;

export default function ButtonDemo(heading: DemoHeading) {
  return (
    <DemoSection
      {...heading}
      description="A native button in four variants and three sizes. Every other button attribute (type, onClick, aria-*) passes straight through."
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.row}>
          <Button type="button">Save project</Button>
          <Button type="button" variant="secondary">
            Preview
          </Button>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
          <Button type="button" variant="danger">
            Delete
          </Button>
        </div>
        <div className={demo.row}>
          <Button type="button" size="small">
            Small
          </Button>
          <Button type="button">Medium</Button>
          <Button type="button" size="large">
            Large
          </Button>
        </div>
        <Button type="button" fullWidth>
          Send message
        </Button>
      </div>
    </DemoSection>
  );
}
