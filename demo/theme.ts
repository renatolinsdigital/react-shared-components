import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light';

export const ThemeContext = createContext<Theme>('dark');

export function useDemoTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * The accent per theme, as `r,g,b`, for the canvas effects, which cannot read CSS custom
 * properties. Keep in step with `accent` in `$palettes` (src/styles/_theme.scss).
 */
export const ACCENT_RGB: Record<Theme, string> = {
  dark: '200,255,0',
  light: '82,115,0',
};
