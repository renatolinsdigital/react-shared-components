import { useState } from 'react';
import { Button, Tag } from 'react-shared-components';
import DemoSection from '../components/DemoSection';
import type { DemoHeading } from '../components/DemoSection';
import demo from './demo.module.scss';

const TOPICS = ['Motion', 'Canvas', 'Accessibility', 'Typography'];
const ALL_SKILLS = ['React', 'TypeScript', 'GSAP', 'Canvas'];

const CODE = `<Tag label="Next.js" />

<Tag label="Motion" active={isActive} onClick={toggleMotion} />

<Tag label="GSAP" active onRemove={removeGsap} removeLabel="Remove GSAP" />`;

export default function TagDemo(heading: DemoHeading) {
  const [activeTopics, setActiveTopics] = useState<string[]>(['Motion']);
  const [skills, setSkills] = useState(ALL_SKILLS);

  const toggleTopic = (topic: string) =>
    setActiveTopics((current) =>
      current.includes(topic)
        ? current.filter((activeTopic) => activeTopic !== topic)
        : [...current, topic],
    );

  return (
    <DemoSection
      {...heading}
      description="A pill label in three forms: plain text, a toggle button that reports aria-pressed, or a chip with its own remove button. A tag is pressed or removable, never both, since buttons cannot nest."
      code={CODE}
    >
      <div className={demo.stack}>
        <div>
          <p className={demo.caption}>Plain</p>
          <div className={demo.row}>
            <Tag label="Next.js" />
            <Tag label="SCSS" />
            <Tag label="Vitest" />
          </div>
        </div>
        <div>
          <p className={demo.caption}>Clickable</p>
          <div className={demo.row}>
            {TOPICS.map((topic) => (
              <Tag
                key={topic}
                label={topic}
                active={activeTopics.includes(topic)}
                onClick={() => toggleTopic(topic)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className={demo.caption}>Removable</p>
          <div className={demo.row}>
            {skills.map((skill) => (
              <Tag
                key={skill}
                label={skill}
                active
                onRemove={() =>
                  setSkills((current) => current.filter((currentSkill) => currentSkill !== skill))
                }
                removeLabel={`Remove ${skill}`}
              />
            ))}
            {skills.length < ALL_SKILLS.length && (
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => setSkills(ALL_SKILLS)}
              >
                Bring them back
              </Button>
            )}
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
