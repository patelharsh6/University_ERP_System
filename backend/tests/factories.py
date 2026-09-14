"""
Test factories and helpers for generating users, records, and authenticated clients.
"""
from rest_framework.test import APIClient
from accounts.models import User
from students.models import StudentProfile
from faculty.models import FacultyProfile
from courses.models import Subject, Course, Enrollment, Assignment, StudyMaterial
from attendance.models import AttendanceRecord, Timetable
from fees.models import FeeStructure, FeePayment
from results.models import ExamResult
from announcements.models import Announcement, Notification
from feedback.models import CourseFeedback


def create_user(role=User.Role.STUDENT, username='testuser', email='test@university.edu', password='password123', **kwargs):
    """Create a user with specified role and credentials."""
    user = User(
        username=username,
        email=email,
        role=role,
        first_name=kwargs.get('first_name', 'Test'),
        last_name=kwargs.get('last_name', 'User'),
        enrollment_id=kwargs.get('enrollment_id', None),
        employee_id=kwargs.get('employee_id', None),
        is_active_account=kwargs.get('is_active_account', True),
    )
    user.set_password(password)
    user.save()
    return user


def create_student(username='student1', email='student1@university.edu', enrollment_id='21CS001', **kwargs):
    user = create_user(
        role=User.Role.STUDENT,
        username=username,
        email=email,
        enrollment_id=enrollment_id,
        first_name=kwargs.get('first_name', 'Alice'),
        last_name=kwargs.get('last_name', 'Student'),
    )
    profile = StudentProfile.objects.create(
        user=user,
        department=kwargs.get('department', 'Computer Science'),
        semester=kwargs.get('semester', '1st'),
        course_name=kwargs.get('course_name', 'B.Tech (CSE)'),
        admission_year=kwargs.get('admission_year', 2024),
    )
    return user, profile


def create_faculty(username='faculty1', email='faculty1@university.edu', employee_id='FAC001', **kwargs):
    user = create_user(
        role=User.Role.FACULTY,
        username=username,
        email=email,
        employee_id=employee_id,
        first_name=kwargs.get('first_name', 'Dr. Bob'),
        last_name=kwargs.get('last_name', 'Faculty'),
    )
    profile = FacultyProfile.objects.create(
        user=user,
        department=kwargs.get('department', 'Computer Science'),
        designation=kwargs.get('designation', 'Professor'),
    )
    return user, profile


def create_admin(username='admin1', email='admin1@university.edu', **kwargs):
    user = create_user(
        role=User.Role.ADMIN,
        username=username,
        email=email,
        first_name=kwargs.get('first_name', 'Admin'),
        last_name=kwargs.get('last_name', 'User'),
        is_staff=True,
        is_superuser=True,
    )
    return user


def get_auth_client(user=None):
    """Return an APIClient authenticated with given user."""
    client = APIClient()
    if user:
        client.force_authenticate(user=user)
    return client
