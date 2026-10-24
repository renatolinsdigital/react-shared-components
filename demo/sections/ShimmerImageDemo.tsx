import { useState } from 'react';
import { Button, ShimmerImage } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const PHOTOS = [
  { id: 'photo-1498050108023-c5249f4df085', alt: 'Code on a laptop screen' },
  { id: 'photo-1461749280684-dccba630e2f6', alt: 'Code on a monitor in a dark room' },
  { id: 'photo-1555066931-4365d14bab8c', alt: 'Close-up of colourful source code' },
];

const CODE = `// The parent must be positioned and sized: the image fills it.
<div style={{ position: 'relative', aspectRatio: '4 / 3' }}>
  <ShimmerImage src={coverUrl} alt="Code on a laptop screen" />
</div>`;

export default function ShimmerImageDemo(heading: DemoHeading) {
  // A new query string makes each photo a fresh request, so the shimmer shows again
  const [loadRound, setLoadRound] = useState(0);

  return (
    <DemoSection
      {...heading}
      description="An image that fills its positioned parent, shimmers while the file loads and fades in once it has decoded. Visitors who ask for reduced motion get no sweep and no blur."
      code={CODE}
    >
      <div className={demo.stack}>
        <div className={demo.grid}>
          {PHOTOS.map((photo) => (
            <div key={photo.id} className={demo.imageFrame}>
              <ShimmerImage
                src={`https://images.unsplash.com/${photo.id}?w=800&q=70&round=${loadRound}`}
                alt={photo.alt}
              />
            </div>
          ))}
        </div>
        <div>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setLoadRound((round) => round + 1)}
          >
            Load them again
          </Button>
        </div>
      </div>
    </DemoSection>
  );
}
