import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mockPost, mockGet } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGet: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  default: {
    post: mockPost,
    get: mockGet,
  },
}));

import { useAuthStore } from '@/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set user and update authentication state', () => {
    const mockUser = {
      id: 1,
      name: 'Admin Desa',
      email: 'admin@desa.id',
      is_active: true,
      roles: [{ name: 'admin' }],
      permissions: [{ name: 'dashboard.view' }],
    };

    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear state on logout', async () => {
    useAuthStore.setState({
      user: { id: 1, name: 'Admin', email: 'admin@desa.id', is_active: true, roles: [], permissions: [] } as any,
      token: 'test-token',
      isAuthenticated: true,
    });
    localStorage.setItem('token', 'test-token');

    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 1,
      name: 'Admin Desa',
      email: 'admin@desa.id',
      is_active: true,
      roles: [{ name: 'admin' }],
      permissions: [{ name: 'dashboard.view' }],
    };
    mockPost.mockResolvedValueOnce({ data: { token: 'new-token', user: mockUser } });

    await useAuthStore.getState().login('admin@desa.id', 'password');

    const state = useAuthStore.getState();
    expect(state.token).toBe('new-token');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('should handle login API error', async () => {
    mockPost.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });

    const { login } = useAuthStore.getState();
    try {
      await login('wrong@email.com', 'wrongpass');
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.response.data.message).toBe('Invalid credentials');
      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.token).toBeNull();
    }
  });

  it('should fetch user successfully via fetchUser', async () => {
    const mockUser = {
      id: 1,
      name: 'Admin Desa',
      email: 'admin@desa.id',
      is_active: true,
      roles: [{ name: 'admin' }],
      permissions: [{ name: 'dashboard.view' }],
    };
    mockGet.mockResolvedValueOnce({ data: { user: mockUser } });

    useAuthStore.setState({ token: 'valid-token' });
    await useAuthStore.getState().fetchUser();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear auth on fetchUser 401 error', async () => {
    mockGet.mockRejectedValueOnce(new Error('Unauthorized'));

    useAuthStore.setState({
      token: 'expired-token',
      user: { id: 1, name: 'Admin', email: 'admin@desa.id', is_active: true, roles: [], permissions: [] } as any,
      isAuthenticated: true,
    });
    localStorage.setItem('token', 'expired-token');

    await useAuthStore.getState().fetchUser();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
