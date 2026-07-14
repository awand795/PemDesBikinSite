import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '@/stores/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useThemeStore.setState({ theme: 'light' });
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should start with light theme by default', () => {
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
  });

  it('should toggle from light to dark', () => {
    const { toggleTheme } = useThemeStore.getState();
    toggleTheme();
    const { theme } = useThemeStore.getState();
    expect(theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    useThemeStore.setState({ theme: 'dark' });
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    const { toggleTheme } = useThemeStore.getState();
    toggleTheme();

    const { theme } = useThemeStore.getState();
    expect(theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should set theme explicitly', () => {
    const { setTheme } = useThemeStore.getState();
    setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should initialize from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const { initTheme } = useThemeStore.getState();
    initTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
