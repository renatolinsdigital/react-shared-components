import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PageTransition from './PageTransition';
import styles from './PageTransition.module.scss';

let pendingFrames: FrameRequestCallback[] = [];

/** Runs the animation frames requested so far, as the browser would on its next paints. */
function paintFrames() {
  act(() => {
    for (let frame = 0; frame < 2; frame++) {
      const frames = pendingFrames;
      pendingFrames = [];
      frames.forEach((callback) => callback(0));
    }
  });
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    pendingFrames.push(callback);
    return pendingFrames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
  pendingFrames = [];
  vi.unstubAllGlobals();
});

describe('PageTransition', () => {
  it('fades its content in after it mounts', () => {
    render(<PageTransition transitionKey="/a">Page A</PageTransition>);
    expect(screen.getByText('Page A')).not.toHaveClass(styles.visible);

    paintFrames();
    expect(screen.getByText('Page A')).toHaveClass(styles.visible);
  });

  it('shows its first content at once with appear off, in the server HTML too', () => {
    const serverHtml = renderToString(
      <PageTransition transitionKey="/a" appear={false}>
        Page A
      </PageTransition>,
    );
    expect(serverHtml).toContain(styles.visible);

    render(
      <PageTransition transitionKey="/a" appear={false}>
        Page A
      </PageTransition>,
    );
    expect(screen.getByText('Page A')).toHaveClass(styles.visible);

    paintFrames();
    expect(screen.getByText('Page A')).toHaveClass(styles.visible);
  });

  it('still fades when the key changes with appear off', () => {
    const { rerender } = render(
      <PageTransition transitionKey="/a" appear={false}>
        Page A
      </PageTransition>,
    );

    rerender(
      <PageTransition transitionKey="/b" appear={false}>
        Page B
      </PageTransition>,
    );
    expect(screen.getByText('Page B')).not.toHaveClass(styles.visible);

    paintFrames();
    expect(screen.getByText('Page B')).toHaveClass(styles.visible);

    rerender(
      <PageTransition transitionKey="/a" appear={false}>
        Page A
      </PageTransition>,
    );
    expect(screen.getByText('Page A')).not.toHaveClass(styles.visible);
  });
});
