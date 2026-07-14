import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// HOISTED: These run before vi.mock and import statements
// ============================================================
const {
  requestInterceptor,
  responseInterceptorSuccess,
  responseInterceptorError,
  mockAxiosInstance,
} = vi.hoisted(() => {
  // We'll store the interceptors so the test can invoke them
  let _requestInterceptor: ((config: any) => any) | null = null;
  let _responseSuccess: ((response: any) => any) | null = null;
  let _responseError: ((error: any) => any) | null = null;

  const mockAxiosInstance = {
    defaults: { baseURL: '', headers: {} },
    interceptors: {
      request: {
        use: vi.fn((handler: any) => {
          _requestInterceptor = handler;
        }),
        eject: vi.fn(),
        clear: vi.fn(),
      },
      response: {
        use: vi.fn((successHandler: any, errorHandler: any) => {
          _responseSuccess = successHandler;
          _responseError = errorHandler;
        }),
        eject: vi.fn(),
        clear: vi.fn(),
      },
    },
  };

  return {
    requestInterceptor: {
      get handler() { return _requestInterceptor; },
    },
    responseInterceptorSuccess: {
      get handler() { return _responseSuccess; },
    },
    responseInterceptorError: {
      get handler() { return _responseError; },
    },
    mockAxiosInstance,
  };
});

// ============================================================
// Mock axios BEFORE importing api
// ============================================================
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    create: vi.fn(() => mockAxiosInstance),
  };
});

// Now import the api module — its axios.create() call will use our mock
import api from '@/services/api';

describe('api.ts — axios interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Stub window.location for jsdom compatibility
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  // ==================== REQUEST INTERCEPTOR ====================

  describe('request interceptor', () => {
    it('should add Authorization header when token exists in localStorage', () => {
      localStorage.setItem('token', 'my-test-token');

      const config = { headers: {} };
      const result = requestInterceptor.handler!(config);

      expect(result.headers.Authorization).toBe('Bearer my-test-token');
    });

    it('should not add Authorization header when no token exists', () => {
      const config = { headers: {} };
      const result = requestInterceptor.handler!(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle empty token string in localStorage', () => {
      localStorage.setItem('token', '');

      const config = { headers: {} };
      const result = requestInterceptor.handler!(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should return the config object as-is', () => {
      localStorage.setItem('token', 'token-123');

      const config = { headers: { 'X-Custom': 'value' }, url: '/test' };
      const result = requestInterceptor.handler!(config);

      expect(result).toBe(config);
      expect(result.url).toBe('/test');
      expect(result.headers['X-Custom']).toBe('value');
    });
  });

  // ==================== RESPONSE INTERCEPTOR (success) ====================

  describe('response interceptor — success', () => {
    it('should pass through successful response unchanged', () => {
      const response = { data: { message: 'ok' }, status: 200 };
      const result = responseInterceptorSuccess.handler!(response);

      expect(result).toBe(response);
    });

    it('should pass through any successful status code', () => {
      const response201 = { data: { id: 1 }, status: 201 };
      const result = responseInterceptorSuccess.handler!(response201);

      expect(result).toBe(response201);
    });
  });

  // ==================== RESPONSE INTERCEPTOR (error) ====================

  describe('response interceptor — error (401 handling)', () => {
    it('should remove token from localStorage on 401', async () => {
      localStorage.setItem('token', 'expired-token');

      const error = { response: { status: 401 } };
      const promise = responseInterceptorError.handler!(error);

      // Side effects happen synchronously before Promise.reject()
      expect(localStorage.getItem('token')).toBeNull();
      // Promise should be rejected
      await expect(promise).rejects.toBe(error);
    });

    it('should redirect to /admin/login on 401', async () => {
      localStorage.setItem('token', 'expired-token');

      const error = { response: { status: 401 } };
      const promise = responseInterceptorError.handler!(error);

      expect(window.location.href).toBe('/admin/login');
      await expect(promise).rejects.toBe(error);
    });

    it('should reject the promise on 401', async () => {
      const error = { response: { status: 401 } };
      const promise = responseInterceptorError.handler!(error);

      await expect(promise).rejects.toBeDefined();
    });

    it('should NOT remove token or redirect on non-401 error', async () => {
      localStorage.setItem('token', 'still-valid');

      const error403 = { response: { status: 403, data: { message: 'Forbidden' } } };
      const promise = responseInterceptorError.handler!(error403);

      // Token should still be there
      expect(localStorage.getItem('token')).toBe('still-valid');
      // Promise should be rejected with the original error
      await expect(promise).rejects.toBe(error403);
    });

    it('should NOT remove token or redirect on network error (no response)', async () => {
      localStorage.setItem('token', 'still-valid');

      const networkError = new Error('Network Error');
      const promise = responseInterceptorError.handler!(networkError);

      expect(localStorage.getItem('token')).toBe('still-valid');
      await expect(promise).rejects.toBe(networkError);
    });

    it('should reject with the original error object', async () => {
      const error = { response: { status: 500 }, message: 'Server Error' };
      const promise = responseInterceptorError.handler!(error);

      await expect(promise).rejects.toBe(error);
      await expect(promise).rejects.toHaveProperty('message', 'Server Error');
    });

    it('should handle 401 with no token in localStorage gracefully', async () => {
      // No token in localStorage — should not crash
      const error = { response: { status: 401 } };
      const promise = responseInterceptorError.handler!(error);

      // Should still redirect
      expect(window.location.href).toBe('/admin/login');
      // Promise should be rejected
      await expect(promise).rejects.toBe(error);
    });
  });

  // ==================== AXIOS INSTANCE CREATION ====================

  describe('axios instance creation', () => {
    it('should be imported and have interceptors configured', () => {
      expect(api).toBeDefined();
      expect(api.interceptors).toBeDefined();
    });

    it('should have registered request interceptor', () => {
      // Interceptors are registered during module import (before vi.clearAllMocks() in beforeEach)
      // So we check that the handler was captured correctly instead
      expect(typeof requestInterceptor.handler).toBe('function');
    });

    it('should have registered response interceptor', () => {
      expect(typeof responseInterceptorSuccess.handler).toBe('function');
      expect(typeof responseInterceptorError.handler).toBe('function');
    });
  });
});
