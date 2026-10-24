import { useEffect, useState } from 'react';
import { Button, Container, LogoMark, PageHero, ToastProvider } from 'react-shared-components';
import { DEMO_COUNT, DEMO_GROUPS } from './demos';
import { ACCENT_HEX, ThemeContext } from './theme';
import type { Theme } from './theme';
import styles from './App.module.scss';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

  // The palette hangs off data-theme on <html>, as it would in an app
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext value={theme}>
      <ToastProvider dismissLabel="Dismiss notification">
        <header className={styles.topBar}>
          <a href="#top" className={styles.brand}>
            <LogoMark preset="minimal" size={18} opacity={0.9} color={ACCENT_HEX[theme]} />
            react-shared-components
          </a>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setTheme(nextTheme)}
          >
            Switch to {nextTheme} theme
          </Button>
        </header>

        <div className={styles.layout}>
          <nav className={styles.sidebar} aria-label="Components and hooks">
            {DEMO_GROUPS.map((group) => (
              <div key={group.title} className={styles.navGroup}>
                <p className={styles.navTitle}>{group.title}</p>
                <ul className={styles.navList}>
                  {group.entries.map((entry) => (
                    <li key={entry.id}>
                      <a className={styles.navLink} href={`#${entry.id}`}>
                        {entry.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <main id="top" className={styles.main}>
            <PageHero
              eyebrow="Component library"
              title="react-shared-components"
              subtitle="React components and hooks that know nothing about the app around them: form fields, layout, Markdown, toasts and canvas effects. Every one is live below, in both themes."
              count={DEMO_COUNT}
              countLabel="components and hooks"
            />
            {DEMO_GROUPS.map((group) => (
              <div key={group.title} className={styles.group}>
                <Container>
                  <h2 className={styles.groupTitle}>{group.title}</h2>
                  {group.entries.map(({ Demo, ...heading }) => (
                    <Demo key={heading.id} {...heading} />
                  ))}
                </Container>
              </div>
            ))}
          </main>
        </div>
      </ToastProvider>
    </ThemeContext>
  );
}
