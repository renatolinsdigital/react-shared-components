import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light';

export const ThemeContext = createContext<Theme>('dark');

export function useDemoTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * The accent per theme for the canvas and SVG effects, which cannot read CSS custom properties.
 * Keep in step with `accent` in `$palettes` (src/styles/_theme.scss).
 */
export const ACCENT_HEX: Record<Theme, string> = {
  dark: '#c8ff00',
  light: '#527300',
};

export const ACCENT_RGB: Record<Theme, string> = {
  dark: '200,255,0',
  light: '82,115,0',
};
