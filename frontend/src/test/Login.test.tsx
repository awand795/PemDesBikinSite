import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// ============================================================
// HOISTED: Create mock functions and store state BEFORE vi.mock
// ============================================================
const mockLogin = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

const { mockUseAuthStore } = vi.hoisted(() => {
  const state: {
    login: ReturnType<typeof vi.fn>;
    isLoading: boolean;
  } = {
    login: mockLogin,
    isLoading: false,
  };

  const listeners = new Set<() => void>();
  const setState = (newState: Partial<typeof state>) => {
    Object.assign(state, newState);
    listeners.forEach((l) => l());
  };

  const useAuthStore = Object.assign(
    (selector?: (s: typeof state) => any) => {
      return selector ? selector(state) : state;
    },
    {
      getState: () => state,
      setState,
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      getInitialState: () => ({ ...state }),
    }
  );

  return { mockUseAuthStore: useAuthStore };
});

vi.mock('@/stores/authStore', () => ({
  useAuthStore: mockUseAuthStore,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { default as Login } from '@/features/auth/Login';

function renderLogin() {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReset();
    mockNavigate.mockReset();
    mockUseAuthStore.setState({ isLoading: false, login: mockLogin });
  });

  // ==================== RENDER ====================

  it('should render the login form', () => {
    renderLogin();

    // There are two 'Masuk' texts (h2 and button), use getAllByText
    const masukElements = screen.getAllByText('Masuk');
    expect(masukElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Panel Admin Desa')).toBeInTheDocument();
    // Input fields without htmlFor/id need placeholder query or role
    expect(screen.getByPlaceholderText('admin@desa.id')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });

  it('should render branding elements', () => {
    renderLogin();

    expect(screen.getByText('PemDesBikinSite')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Panel administrasi untuk mengelola data penduduk, layanan surat, berita, pengaduan, dan informasi desa lainnya.'
      )
    ).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    renderLogin();

    const forgotLink = screen.getByText('Lupa password?');
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute(
      'href',
      '/admin/forgot-password'
    );
  });

  it('should render back to website link', () => {
    renderLogin();

    const backLinks = screen.getAllByText('Kembali ke Website');
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('should render demo credentials in dev mode', () => {
    renderLogin();

    expect(screen.getByText(/admin@desa.id/)).toBeInTheDocument();
  });

  // ==================== FORM INPUTS ====================

  it('should update email input on user typing', async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    await userEvent.type(emailInput, 'admin@desa.id');

    expect(emailInput).toHaveValue('admin@desa.id');
  });

  it('should update password input on user typing', async () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    await userEvent.type(passwordInput, 'secret123');

    expect(passwordInput).toHaveValue('secret123');
  });

  // ==================== PASSWORD VISIBILITY TOGGLE ====================

  it('should toggle password visibility when eye icon is clicked', () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find the toggle button (the only button element with type="button")
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(
      (b) => b.getAttribute('type') === 'button'
    );
    expect(toggleButton).toBeDefined();
    fireEvent.click(toggleButton!);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  // ==================== SUBMISSION ====================

  it('should call login with email and password on form submit', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /masuk/i });

    await userEvent.type(emailInput, 'admin@desa.id');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@desa.id', 'password123');
    });
  });

  it('should navigate to dashboard on successful login', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /masuk/i });

    await userEvent.type(emailInput, 'admin@desa.id');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  // ==================== ERROR HANDLING ====================

  it('should show error message on login failure', async () => {
    const errorMessage = 'Email atau password salah.';
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /masuk/i });

    await userEvent.type(emailInput, 'wrong@email.com');
    await userEvent.type(passwordInput, 'wrongpass');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should show fallback error from nested validation errors', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        data: { errors: { email: ['Email tidak valid'] } },
      },
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Find and submit the form directly to ensure handleSubmit runs
    const form = emailInput.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });

    await waitFor(() => {
      // The error is 'Email tidak valid' from errors.email[0]
      const errorEl = screen.getByText('Email tidak valid');
      expect(errorEl).toBeInTheDocument();
    });
  });

  it('should show fallback error message when no specific error is returned', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network Error'));

    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /masuk/i });

    await userEvent.type(emailInput, 'admin@desa.id');
    await userEvent.type(passwordInput, 'pass');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Login gagal. Silakan coba lagi.')
      ).toBeInTheDocument();
    });
  });

  it('should not navigate on failed login', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: 'Error' } },
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /masuk/i });

    await userEvent.type(emailInput, 'admin@desa.id');
    await userEvent.type(passwordInput, 'wrong');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ==================== LOADING STATE ====================

  it('should show loading spinner while logging in', () => {
    mockUseAuthStore.setState({ isLoading: true, login: mockLogin });

    renderLogin();

    expect(screen.getByText('Memproses...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /memproses/i })
    ).toBeDisabled();
  });

  it('should disable submit button while loading', () => {
    mockUseAuthStore.setState({ isLoading: true, login: mockLogin });

    renderLogin();

    const submitButton = screen.getByRole('button', { name: /memproses/i });
    expect(submitButton).toBeDisabled();
  });

  // ==================== FORM VALIDATION ====================

  it('should require email input', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('admin@desa.id');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should require password input', () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('required');
  });
});
