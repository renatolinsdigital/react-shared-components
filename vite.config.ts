/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

function fromRoot(relativePath: string): string {
  return fileURLToPath(new URL(relativePath, import.meta.url));
}

const libraryEntry = fromRoot('./src/bundleEntry.ts');

// The app that installs the library brings its own copy of each of these. Bundling them would
// ship a second React (hooks then throw) and a second GSAP, whose ScrollTrigger would never see
// the app's refreshes.
const externalPackages = [
  ...Object.keys(packageJson.peerDependencies),
  ...Object.keys(packageJson.dependencies),
];

function isExternal(moduleId: string): boolean {
  return externalPackages.some(
    (packageName) => moduleId === packageName || moduleId.startsWith(`${packageName}/`),
  );
}

const sharedConfig: UserConfig = {
  plugins: [react()],
  css: {
    preprocessorOptions: {
      // Lets every module write `@use 'theme' as *;` instead of a relative path.
      scss: { loadPaths: [fromRoot('./src/styles')] },
    },
  },
};

const libraryConfig: UserConfig = {
  ...sharedConfig,
  build: {
    outDir: 'dist',
    lib: {
      entry: libraryEntry,
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: isExternal,
      // Bundling strips each file's own 'use client'. One banner keeps the whole library usable
      // from React Server Components (Next.js App Router), where every part of it is client-side.
      output: { banner: "'use client';" },
    },
  },
};

const demoConfig: UserConfig = {
  ...sharedConfig,
  root: fromRoot('./demo'),
  base: './',
  resolve: {
    // The demo imports the library by its package name, exactly as an app would, but from source.
    alias: [{ find: /^react-shared-components$/, replacement: libraryEntry }],
  },
  build: {
    outDir: fromRoot('./demo-dist'),
    emptyOutDir: true,
  },
};

const testConfig: UserConfig = {
  ...sharedConfig,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
  },
};

export default defineConfig(({ command, mode }) => {
  if (mode === 'test') return testConfig;
  if (command === 'build' && mode !== 'demo') return libraryConfig;
  return demoConfig;
});
