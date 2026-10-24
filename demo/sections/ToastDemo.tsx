import { Button, useToast } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const CODE = `// Once, near the root:
<ToastProvider dismissLabel="Dismiss notification">
  <App />
</ToastProvider>

// Anywhere below it:
const { addToast } = useToast();
addToast('Project saved.');
addToast('Could not reach the server.', 'error');
addToast('A new version is available.', 'info', 8000);`;

export default function ToastDemo(heading: DemoHeading) {
  const { addToast } = useToast();

  return (
    <DemoSection
      {...heading}
      description="Stacked notifications in the top right corner, each with its own timer, progress bar and close button. The provider wraps the app; useToast() adds a toast from anywhere below it."
      code={CODE}
    >
      <div className={demo.row}>
        <Button type="button" size="small" onClick={() => addToast('Project saved.')}>
          Success
        </Button>
        <Button
          type="button"
          size="small"
          variant="danger"
          onClick={() => addToast('Could not reach the server.', 'error')}
        >
          Error
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={() => addToast('Your session ends in 5 minutes.', 'warning')}
        >
          Warning
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={() => addToast('A new version is available.', 'info', 8000)}
        >
          Info, for 8 seconds
        </Button>
      </div>
    </DemoSection>
  );
}
