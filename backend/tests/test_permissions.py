"""
Permissions and Row-Level Scoping Test Suite.
Verifies the 2-axis security model across all resources and systematically proves
that defects §9.1, §9.2, §9.3, §9.4, and §9.9 are resolved.
"""
from datetime import date
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User
from students.models import StudentProfile, LeaveRequest
from faculty.models import FacultyProfile
from courses.models import Subject, Course, Enrollment, Assignment
from attendance.models import AttendanceRecord
from fees.models import FeeStructure, FeePayment
from results.models import ExamResult
from announcements.models import Announcement
from feedback.models import CourseFeedback
from tests.factories import create_student, create_faculty, create_admin, get_auth_client


class PermissionsAndScopingTests(TestCase):

    def setUp(self):
        # Two distinct students
        self.student_a, self.profile_a = create_student(
            username='student_a', email='a@university.edu', enrollment_id='21CS001'
        )
        self.student_b, self.profile_b = create_student(
            username='student_b', email='b@university.edu', enrollment_id='21CS002'
        )

        # Faculty and Admin
        self.faculty, self.faculty_profile = create_faculty(
            username='prof_smith', email='smith@university.edu', employee_id='EMP201'
        )
        self.admin = create_admin(username='admin_boss', email='boss@university.edu')

        # API Clients
        self.client_a = get_auth_client(self.student_a)
        self.client_b = get_auth_client(self.student_b)
        self.client_fac = get_auth_client(self.faculty)
        self.client_admin = get_auth_client(self.admin)

        # Academic fixtures
        self.subject = Subject.objects.create(
            name='Algorithms', code='CS201', department='Computer Science', credits=4, semester='3rd'
        )
        self.course = Course.objects.create(
            title='Data Structures & Algorithms', code='CS201-C', instructor=self.faculty,
            subject=self.subject, semester='3rd', is_published=True
        )
        self.fee_structure = FeeStructure.objects.create(
            name='Semester 3 Tuition', amount=50000.00, semester='3rd', academic_year='2024-25'
        )

    # ─── Defect 1: Scoped Detail Views ──────────────────────────────────────────

    def test_student_cannot_access_other_student_exam_result_detail(self):
        """Defect #1: Student A must receive 404 when accessing Student B's ExamResult."""
        result_b = ExamResult.objects.create(
            student=self.student_b, subject=self.subject, exam_type='endterm',
            marks_obtained=88, max_marks=100, is_published=True
        )
        # Student A requesting Student B's result
        response = self.client_a.get(f'/api/results/{result_b.pk}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Student B requesting their own result gets 200
        response_b = self.client_b.get(f'/api/results/{result_b.pk}/')
        self.assertEqual(response_b.status_code, status.HTTP_200_OK)
        self.assertEqual(response_b.data['marks_obtained'], 88)

    def test_student_cannot_access_other_student_fee_payment_detail(self):
        """Defect #1: Student A must receive 404 when accessing Student B's FeePayment."""
        fee_b = FeePayment.objects.create(
            student=self.student_b, fee_structure=self.fee_structure,
            amount_paid=25000, total_amount=50000, due_date=date(2025, 1, 15)
        )
        response = self.client_a.get(f'/api/fees/{fee_b.pk}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_student_cannot_access_other_student_attendance_detail(self):
        """Defect #1: Student A must receive 404 when accessing Student B's Attendance."""
        att_b = AttendanceRecord.objects.create(
            student=self.student_b, subject=self.subject, date=date(2024, 10, 1),
            status=AttendanceRecord.Status.PRESENT, marked_by=self.faculty
        )
        response = self.client_a.get(f'/api/attendance/{att_b.pk}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_student_cannot_access_other_student_profile_detail(self):
        """Defect #1: Student A cannot view or edit Student B's student profile."""
        response = self.client_a.get(f'/api/students/{self.profile_b.pk}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Faculty can view student profiles
        response_fac = self.client_fac.get(f'/api/students/{self.profile_b.pk}/')
        self.assertEqual(response_fac.status_code, status.HTTP_200_OK)

    # ─── Defect 2: Profile Creation Binding ─────────────────────────────────────

    def test_admin_creating_student_profile_binds_to_target_student(self):
        """Defect #2: Admin creating student profile does not bind profile to admin."""
        new_user = User.objects.create_user(
            username='freshstudent', email='fresh@university.edu',
            password='password123', role='student'
        )
        response = self.client_admin.post('/api/students/', {
            'user': new_user.pk,
            'department': 'Mechanical',
            'semester': '1st',
            'course_name': 'B.Tech (ME)',
            'admission_year': 2024,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        profile = StudentProfile.objects.get(user=new_user)
        self.assertEqual(profile.user, new_user)
        self.assertNotEqual(profile.user, self.admin)

    # ─── Defect 3: Leave Request Approval Security ─────────────────────────────

    def test_student_cannot_self_approve_leave_request(self):
        """Defect #3: Student cannot alter the status of their leave request."""
        leave = LeaveRequest.objects.create(
            student=self.student_a, start_date=date(2024, 11, 1), end_date=date(2024, 11, 3),
            reason='Family emergency', status=LeaveRequest.Status.PENDING
        )
        response = self.client_a.patch(f'/api/students/leaves/{leave.pk}/', {
            'status': 'approved'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        leave.refresh_from_db()
        self.assertEqual(leave.status, LeaveRequest.Status.PENDING)

    def test_faculty_can_approve_leave_request(self):
        """Faculty or admin can approve leave requests."""
        leave = LeaveRequest.objects.create(
            student=self.student_a, start_date=date(2024, 11, 1), end_date=date(2024, 11, 3),
            reason='Medical', status=LeaveRequest.Status.PENDING
        )
        response = self.client_fac.patch(f'/api/students/leaves/{leave.pk}/', {
            'status': 'approved'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        leave.refresh_from_db()
        self.assertEqual(leave.status, LeaveRequest.Status.APPROVED)
        self.assertEqual(leave.reviewed_by, self.faculty)

    # ─── Defect 4: Write Protection on Academic Resources ──────────────────────

    def test_student_cannot_create_subject_or_course(self):
        """Defect #4: Students cannot create Subjects or Courses."""
        res_sub = self.client_a.post('/api/courses/subjects/', {
            'name': 'Hacking 101', 'code': 'HACK101', 'department': 'CS', 'semester': '1st'
        })
        self.assertEqual(res_sub.status_code, status.HTTP_403_FORBIDDEN)

        res_course = self.client_a.post('/api/courses/', {
            'title': 'Fake Course', 'code': 'FAKE101', 'subject': self.subject.pk
        })
        self.assertEqual(res_course.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_publish_exam_result(self):
        """Defect #4: Student cannot invent or publish exam results."""
        response = self.client_a.post('/api/results/', {
            'student': self.student_a.pk, 'subject': self.subject.pk,
            'marks_obtained': 100, 'max_marks': 100, 'is_published': True
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_post_announcement(self):
        """Defect #4: Student cannot author announcements."""
        response = self.client_a.post('/api/announcements/', {
            'title': 'No Class Today', 'content': 'Class is cancelled.'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # ─── Unpublished Result Visibility ─────────────────────────────────────────

    def test_student_cannot_see_unpublished_exam_result(self):
        """Students cannot see unpublished results in list or detail."""
        unpub = ExamResult.objects.create(
            student=self.student_a, subject=self.subject, exam_type='midterm',
            marks_obtained=95, max_marks=100, is_published=False
        )
        # Detail view returns 404
        res_detail = self.client_a.get(f'/api/results/{unpub.pk}/')
        self.assertEqual(res_detail.status_code, status.HTTP_404_NOT_FOUND)

        # List view excludes unpublished results
        res_list = self.client_a.get('/api/results/')
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        ids = [r['id'] for r in res_list.data['results']]
        self.assertNotIn(unpub.pk, ids)

        # Faculty can see unpublished results
        res_fac = self.client_fac.get(f'/api/results/{unpub.pk}/')
        self.assertEqual(res_fac.status_code, status.HTTP_200_OK)

    # ─── Defect 9: Anonymous Feedback Privacy ──────────────────────────────────

    def test_anonymous_feedback_does_not_leak_student_identity(self):
        """Defect #9: Anonymous feedback completely strips student identity for faculty."""
        feedback = CourseFeedback.objects.create(
            student=self.student_a, course=self.course, instructor=self.faculty,
            overall_rating=5, comments='Great course!', is_anonymous=True
        )
        response = self.client_fac.get(f'/api/feedback/{feedback.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data.get('student'))
        self.assertEqual(response.data.get('student_name'), 'Anonymous')

    # ─── Derived Fields (§8) ───────────────────────────────────────────────────

    def test_exam_result_auto_derives_grade_and_points(self):
        """ExamResult.save() computes correct grade and grade_points."""
        result = ExamResult.objects.create(
            student=self.student_a, subject=self.subject, exam_type='endterm',
            marks_obtained=85, max_marks=100, is_published=True
        )
        self.assertEqual(result.grade, 'A')
        self.assertEqual(result.grade_points, 9.0)
