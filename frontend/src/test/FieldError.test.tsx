import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FieldError from '@/components/ui/FieldError';

describe('FieldError', () => {
  it('should render error message when provided', () => {
    render(<FieldError message="Field ini wajib diisi" />);
    expect(screen.getByText('Field ini wajib diisi')).toBeInTheDocument();
  });

  it('should render a paragraph element', () => {
    render(<FieldError message="Error message" />);
    const element = screen.getByText('Error message');
    expect(element.tagName).toBe('P');
  });

  it('should return null when no message', () => {
    const { container } = render(<FieldError />);
    expect(container.innerHTML).toBe('');
  });

  it('should return null when message is empty string', () => {
    const { container } = render(<FieldError message="" />);
    expect(container.innerHTML).toBe('');
  });
});
