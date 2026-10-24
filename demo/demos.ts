import type { ComponentType } from 'react';
import type { DemoHeading } from './components/DemoSection';
import ButtonDemo from './sections/ButtonDemo';
import ContainerDemo from './sections/ContainerDemo';
import LogoMarkDemo from './sections/LogoMarkDemo';
import MarkdownDemo from './sections/MarkdownDemo';
import MarkdownEditorDemo from './sections/MarkdownEditorDemo';
import MatrixContainerDemo from './sections/MatrixContainerDemo';
import OrbitalDotsDemo from './sections/OrbitalDotsDemo';
import PageHeroDemo from './sections/PageHeroDemo';
import PageTransitionDemo from './sections/PageTransitionDemo';
import SectionDemo from './sections/SectionDemo';
import SelectDemo from './sections/SelectDemo';
import ShimmerImageDemo from './sections/ShimmerImageDemo';
import TagDemo from './sections/TagDemo';
import TagFilterDemo from './sections/TagFilterDemo';
import TextAreaDemo from './sections/TextAreaDemo';
import TextInputDemo from './sections/TextInputDemo';
import ToastDemo from './sections/ToastDemo';
import UseCountUpDemo from './sections/UseCountUpDemo';
import UseDragReorderDemo from './sections/UseDragReorderDemo';
import UseRotatingMessageDemo from './sections/UseRotatingMessageDemo';

export interface DemoEntry extends DemoHeading {
  Demo: ComponentType<DemoHeading>;
}

export interface DemoGroup {
  title: string;
  entries: DemoEntry[];
}

function toAnchorId(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function componentDemo(componentName: string, Demo: ComponentType<DemoHeading>): DemoEntry {
  return {
    id: toAnchorId(componentName),
    title: componentName,
    readmePath: `src/components/${componentName}/README.md`,
    Demo,
  };
}

function hookDemo(hookName: string, Demo: ComponentType<DemoHeading>): DemoEntry {
  return { id: toAnchorId(hookName), title: hookName, readmePath: 'src/hooks/README.md', Demo };
}

/** Every component and hook in the library, in the order the page and its sidebar show them. */
export const DEMO_GROUPS: DemoGroup[] = [
  {
    title: 'Layout',
    entries: [
      componentDemo('Container', ContainerDemo),
      componentDemo('Section', SectionDemo),
      componentDemo('PageHero', PageHeroDemo),
      componentDemo('PageTransition', PageTransitionDemo),
    ],
  },
  {
    title: 'Forms',
    entries: [
      componentDemo('Button', ButtonDemo),
      componentDemo('TextInput', TextInputDemo),
      componentDemo('TextArea', TextAreaDemo),
      componentDemo('Select', SelectDemo),
    ],
  },
  {
    title: 'Tags',
    entries: [componentDemo('Tag', TagDemo), componentDemo('TagFilter', TagFilterDemo)],
  },
  {
    title: 'Content',
    entries: [
      componentDemo('Markdown', MarkdownDemo),
      componentDemo('MarkdownEditor', MarkdownEditorDemo),
      componentDemo('ShimmerImage', ShimmerImageDemo),
    ],
  },
  {
    title: 'Feedback',
    entries: [componentDemo('Toast', ToastDemo)],
  },
  {
    title: 'Canvas effects',
    entries: [
      componentDemo('LogoMark', LogoMarkDemo),
      componentDemo('MatrixContainer', MatrixContainerDemo),
      componentDemo('OrbitalDots', OrbitalDotsDemo),
    ],
  },
  {
    title: 'Hooks',
    entries: [
      hookDemo('useCountUp', UseCountUpDemo),
      hookDemo('useDragReorder', UseDragReorderDemo),
      hookDemo('useRotatingMessage', UseRotatingMessageDemo),
    ],
  },
];

export const DEMO_COUNT = DEMO_GROUPS.reduce((total, group) => total + group.entries.length, 0);
