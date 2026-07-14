import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useThemeStore } from '@/stores/themeStore';

describe('ThemeToggle', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should render the toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should have accessible label in light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Aktifkan mode gelap');
  });

  it('should have accessible label in dark mode', () => {
    useThemeStore.setState({ theme: 'dark' });
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Aktifkan mode terang');
  });

  it('should toggle theme on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should toggle back to light on second click', () => {
    useThemeStore.setState({ theme: 'dark' });
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
