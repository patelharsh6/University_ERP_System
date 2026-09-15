import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import PublicRoute from '../PublicRoute';
import AuthContext from '../../context/AuthContext';

const renderWithAuth = (ui, authValue, initialRoute = '/') => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Route Guards', () => {
  test('ProtectedRoute redirects unauthenticated user to /login', () => {
    const auth = {
      isAuthenticated: false,
      loading: false,
      role: null,
      user: null,
    };

    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/s/dashboard" element={<div>Protected Student Dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login Screen</div>} />
      </Routes>,
      auth,
      '/s/dashboard'
    );

    expect(screen.getByText('Login Screen')).toBeInTheDocument();
    expect(screen.queryByText('Protected Student Dashboard')).not.toBeInTheDocument();
  });

  test('ProtectedRoute redirects unauthorized role to /403', () => {
    const auth = {
      isAuthenticated: true,
      loading: false,
      role: 'student',
      user: { name: 'Student User', role: 'student' },
    };

    renderWithAuth(
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/a/dashboard" element={<div>Admin Secret Dashboard</div>} />
        </Route>
        <Route path="/403" element={<div>403 Forbidden Access</div>} />
      </Routes>,
      auth,
      '/a/dashboard'
    );

    expect(screen.getByText('403 Forbidden Access')).toBeInTheDocument();
    expect(screen.queryByText('Admin Secret Dashboard')).not.toBeInTheDocument();
  });

  test('PublicRoute redirects authenticated user to their role dashboard', () => {
    const auth = {
      isAuthenticated: true,
      loading: false,
      role: 'faculty',
      user: { name: 'Prof. Sharma', role: 'faculty' },
    };

    renderWithAuth(
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <div>Public Login Page</div>
            </PublicRoute>
          }
        />
        <Route path="/f/dashboard" element={<div>Faculty Dashboard Screen</div>} />
      </Routes>,
      auth,
      '/login'
    );

    expect(screen.getByText('Faculty Dashboard Screen')).toBeInTheDocument();
    expect(screen.queryByText('Public Login Page')).not.toBeInTheDocument();
  });
});
