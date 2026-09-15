import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import AuthContext from '../../../context/AuthContext';

const renderLogin = (loginMock = jest.fn()) => {
  const authValue = {
    login: loginMock,
    isAuthenticated: false,
    loading: false,
    user: null,
    role: null,
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Page', () => {
  test('renders login fields, brand headers, and submit button', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: /sign in to portal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email \/ enrollment id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('validates required fields on empty submit', () => {
    const mockLogin = jest.fn();
    renderLogin(mockLogin);

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByText(/please enter your email, enrollment id, or username/i)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderLogin();

    const pwInput = screen.getByLabelText(/^password/i);
    expect(pwInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/show password/i);
    fireEvent.click(toggleBtn);

    expect(pwInput).toHaveAttribute('type', 'text');
  });
});
