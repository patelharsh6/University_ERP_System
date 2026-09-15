import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import authService from '../../services/auth.service';
import { tokenStorage } from '../../services/api';

jest.mock('../../services/auth.service');

const TestConsumer = () => {
  const { user, role, isAuthenticated, loading, login, logout } = useAuth();
  if (loading) return <div>Loading Auth...</div>;
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
      <div data-testid="user-role">{role || 'NO_ROLE'}</div>
      <div data-testid="user-name">{user?.name || 'NO_NAME'}</div>
      <button onClick={() => login('test@adani.edu', 'password123')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    tokenStorage.clearTokens();
    authService.getCurrentUser.mockReturnValue(null);
    authService.getRole.mockReturnValue(null);
    authService.getProfile.mockResolvedValue(null);
  });

  test('initializes as unauthenticated when no token exists', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_OUT');
    expect(screen.getByTestId('user-role')).toHaveTextContent('NO_ROLE');
  });

  test('rehydrates user when token exists and profile succeeds', async () => {
    tokenStorage.setAccessToken('mock-token');
    authService.getProfile.mockResolvedValue({
      id: 1,
      name: 'Harsh Patel',
      role: 'student',
      email: 'harsh@university.edu',
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('user-role')).toHaveTextContent('student');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Harsh Patel');
  });

  test('login updates context state correctly', async () => {
    authService.login.mockResolvedValue({
      token: 'new-token',
      role: 'faculty',
      user: { id: 2, name: 'Dr. Sharma', role: 'faculty' },
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(authService.login).toHaveBeenCalledWith('test@adani.edu', 'password123', true);
  });
});
