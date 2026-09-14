"""
Authentication and Authorization unit tests.
Tests login identity resolution, registration security, token rotation, and user listing.
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User
from tests.factories import create_user, create_student, create_faculty, create_admin, get_auth_client


class AuthTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.student, self.student_profile = create_student(
            username='alice', email='alice@university.edu', enrollment_id='21CS001'
        )
        self.faculty, self.faculty_profile = create_faculty(
            username='drbob', email='bob@university.edu', employee_id='EMP101'
        )
        self.admin = create_admin(username='superadmin', email='admin@university.edu')

    def test_unauthenticated_profile_returns_401_with_error_envelope(self):
        """Anonymous access to /api/auth/profile/ must return 401 error envelope."""
        response = self.client.get('/api/auth/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error']['code'], 'not_authenticated')

    def test_login_via_email(self):
        """Login succeeds using email as identifier."""
        response = self.client.post('/api/auth/login/', {
            'identifier': 'alice@university.edu',
            'password': 'password123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['role'], 'student')

    def test_login_via_enrollment_id(self):
        """Login succeeds using enrollment_id as identifier."""
        response = self.client.post('/api/auth/login/', {
            'identifier': '21CS001',
            'password': 'password123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'student')

    def test_login_via_employee_id(self):
        """Login succeeds using employee_id as identifier."""
        response = self.client.post('/api/auth/login/', {
            'identifier': 'EMP101',
            'password': 'password123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'faculty')

    def test_login_invalid_password_returns_400_envelope(self):
        """Invalid credentials return 400 validation error envelope."""
        response = self.client.post('/api/auth/login/', {
            'identifier': 'alice@university.edu',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_registration_student_succeeds(self):
        """Public self-registration as student succeeds."""
        response = self.client.post('/api/auth/register/', {
            'username': 'newstudent',
            'email': 'newstudent@university.edu',
            'password': 'password123',
            'password_confirm': 'password123',
            'role': 'student',
            'enrollment_id': '21CS099',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newstudent', role='student').exists())

    def test_registration_as_admin_forbidden_for_anonymous(self):
        """Defect #5 fix: Anonymous user cannot register as admin."""
        response = self.client.post('/api/auth/register/', {
            'username': 'fakeadmin',
            'email': 'fakeadmin@university.edu',
            'password': 'password123',
            'password_confirm': 'password123',
            'role': 'admin',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertFalse(User.objects.filter(username='fakeadmin').exists())

    def test_registration_as_faculty_allowed_for_authenticated_admin(self):
        """Admin can register faculty members."""
        admin_client = get_auth_client(self.admin)
        response = admin_client.post('/api/auth/register/', {
            'username': 'newfaculty',
            'email': 'newfaculty@university.edu',
            'password': 'password123',
            'password_confirm': 'password123',
            'role': 'faculty',
            'employee_id': 'EMP999',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newfaculty', role='faculty').exists())

    def test_user_list_forbidden_for_student(self):
        """Defect #6 fix: Students cannot enumerate all users."""
        student_client = get_auth_client(self.student)
        response = student_client.get('/api/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)

    def test_user_list_allowed_for_admin(self):
        """Admin can list all users."""
        admin_client = get_auth_client(self.admin)
        response = admin_client.get('/api/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_logout_blacklists_refresh_token(self):
        """Logout blacklists the refresh token."""
        student_client = get_auth_client(self.student)
        refresh = RefreshToken.for_user(self.student)
        response = student_client.post('/api/auth/logout/', {'refresh': str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Attempting to refresh with the blacklisted token must fail
        refresh_response = self.client.post('/api/auth/token/refresh/', {'refresh': str(refresh)})
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
