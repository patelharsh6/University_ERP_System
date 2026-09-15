import { ApiError, tokenStorage, buildUrl } from '../api';

describe('API Service Utilities', () => {
  beforeEach(() => {
    tokenStorage.clearTokens();
  });

  test('ApiError captures status, code, and fieldErrors', () => {
    const error = new ApiError({
      status: 400,
      code: 'validation_error',
      message: 'Invalid input',
      fieldErrors: { username: ['Username already taken'] },
    });

    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(400);
    expect(error.code).toBe('validation_error');
    expect(error.message).toBe('Invalid input');
    expect(error.fieldErrors.username[0]).toBe('Username already taken');
  });

  test('tokenStorage stores and retrieves tokens correctly', () => {
    expect(tokenStorage.getAccessToken()).toBeNull();
    tokenStorage.setAccessToken('test-access-token', true);
    expect(tokenStorage.getAccessToken()).toBe('test-access-token');

    tokenStorage.setRefreshToken('test-refresh-token', true);
    expect(tokenStorage.getRefreshToken()).toBe('test-refresh-token');

    tokenStorage.clearTokens();
    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });

  test('buildUrl serializes query parameters accurately', () => {
    const url = buildUrl('/api/students/', {
      page: 2,
      search: 'Harsh',
      empty: '',
      omitted: null,
      tags: ['a', 'b'],
    });

    expect(url).toContain('/api/students/');
    expect(url).toContain('page=2');
    expect(url).toContain('search=Harsh');
    expect(url).toContain('tags=a');
    expect(url).toContain('tags=b');
    expect(url).not.toContain('empty=');
    expect(url).not.toContain('omitted=');
  });
});
