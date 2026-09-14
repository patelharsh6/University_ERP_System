"""
Tests for ORM aggregation selectors and dashboard summary endpoints (B5).
"""
from datetime import date, time, timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework import status

from accounts.models import User
from students.models import StudentProfile
from faculty.models import FacultyProfile
from courses.models import Subject, Course, Enrollment, Assignment, AssignmentSubmission
from attendance.models import AttendanceRecord, Timetable
from fees.models import FeeStructure, FeePayment
from results.models import ExamResult
from feedback.models import CourseFeedback
from tests.factories import create_student, create_faculty, create_admin, get_auth_client


class AggregatesAndDashboardTests(TestCase):

    def setUp(self):
        self.student, _ = create_student(username='stu_agg', email='agg@university.edu', enrollment_id='21CS090')
        self.faculty, _ = create_faculty(username='fac_agg', email='fac_agg@university.edu', employee_id='EMP990')
        self.admin = create_admin(username='adm_agg', email='adm_agg@university.edu')

        self.client_stu = get_auth_client(self.student)
        self.client_fac = get_auth_client(self.faculty)
        self.client_adm = get_auth_client(self.admin)

        # Subjects
        self.subj1 = Subject.objects.create(name='Networks', code='CS305', credits=4, semester='5th')
        self.subj2 = Subject.objects.create(name='Compilers', code='CS306', credits=3, semester='5th')

        # Course
        self.course = Course.objects.create(
            title='Computer Networks', code='CS305-C', instructor=self.faculty,
            subject=self.subj1, semester='5th', is_published=True
        )
        self.enrollment = Enrollment.objects.create(student=self.student, course=self.course)

        # Attendance: 3 present, 1 absent in Networks -> 75%
        for i in range(3):
            AttendanceRecord.objects.create(
                student=self.student, subject=self.subj1, date=date(2024, 9, 1 + i),
                status=AttendanceRecord.Status.PRESENT, marked_by=self.faculty
            )
        AttendanceRecord.objects.create(
            student=self.student, subject=self.subj1, date=date(2024, 9, 4),
            status=AttendanceRecord.Status.ABSENT, marked_by=self.faculty
        )

        # Fees: Billed 50000, Paid 30000 -> Balance 20000
        self.fee_struct = FeeStructure.objects.create(name='Semester 5 Fee', amount=50000.00, academic_year='2024-25')
        self.payment = FeePayment.objects.create(
            student=self.student, fee_structure=self.fee_struct,
            amount_paid=30000.00, total_amount=50000.00, due_date=date(2024, 12, 1)
        )

        # Results: 85/100 (grade A, points 9.0) in Networks, 75/100 (grade B+, points 8.0) in Compilers
        ExamResult.objects.create(
            student=self.student, subject=self.subj1, exam_type='endterm', semester='5th',
            marks_obtained=85, max_marks=100, is_published=True
        )
        ExamResult.objects.create(
            student=self.student, subject=self.subj2, exam_type='endterm', semester='5th',
            marks_obtained=75, max_marks=100, is_published=True
        )

    def test_student_me_summary_endpoint(self):
        """GET /api/students/me/summary/ returns accurate metrics."""
        res = self.client_stu.get('/api/students/me/summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        data = res.data
        self.assertEqual(data['attendance']['overall_percentage'], 75.0)
        self.assertEqual(data['attendance']['total_classes'], 4)
        self.assertEqual(data['fees']['total_billed'], 50000.0)
        self.assertEqual(data['fees']['total_paid'], 30000.0)
        self.assertEqual(data['fees']['balance'], 20000.0)
        self.assertEqual(data['academics']['gpa'], 8.5)

    def test_faculty_me_summary_endpoint(self):
        """GET /api/faculty/me/summary/ returns accurate teaching stats."""
        # Add a pending submission
        assign = Assignment.objects.create(
            course=self.course, title='Socket Programming', due_date=timezone.now() + timedelta(days=2), max_marks=50
        )
        AssignmentSubmission.objects.create(
            assignment=assign, student=self.student, submission_text='Submission content',
            status=AssignmentSubmission.Status.PENDING
        )

        res = self.client_fac.get('/api/faculty/me/summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        data = res.data
        self.assertEqual(data['courses_count'], 1)
        self.assertEqual(data['total_enrolled_students'], 1)
        self.assertEqual(data['pending_grading_count'], 1)

    def test_admin_dashboard_summary_endpoint(self):
        """GET /api/auth/admin-summary/ returns high-level university totals."""
        res = self.client_adm.get('/api/auth/admin-summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        data = res.data
        self.assertGreaterEqual(data['headcount']['students'], 1)
        self.assertGreaterEqual(data['headcount']['faculty'], 1)
        self.assertEqual(data['finances']['total_billed'], 50000.0)
        self.assertEqual(data['finances']['total_collected'], 30000.0)
        self.assertEqual(data['finances']['outstanding_balance'], 20000.0)

    def test_transcript_calculation_endpoint(self):
        """GET /api/results/transcript/ computes semester SGPA and overall CGPA correctly."""
        res = self.client_stu.get('/api/results/transcript/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        data = res.data
        # (9.0 * 4 + 8.0 * 3) / 7 = 60 / 7 = 8.57
        self.assertEqual(data['cgpa'], 8.57)
        self.assertEqual(data['total_credits_earned'], 7)
        self.assertEqual(len(data['semesters']), 1)
        self.assertEqual(data['semesters'][0]['semester'], '5th')
        self.assertEqual(data['semesters'][0]['sgpa'], 8.57)

    def test_attendance_summary_endpoint(self):
        """GET /api/attendance/summary/ returns per-subject analytics."""
        res = self.client_stu.get('/api/attendance/summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        data = res.data
        self.assertEqual(data['total_records'], 4)
        self.assertEqual(data['overall_percentage'], 75.0)
        self.assertEqual(len(data['subjects']), 1)
        self.assertEqual(data['subjects'][0]['subject_code'], 'CS305')
        self.assertEqual(data['subjects'][0]['percentage'], 75.0)

    def test_feedback_summary_endpoint(self):
        """GET /api/feedback/summary/ aggregates ratings with zero identity leaks."""
        CourseFeedback.objects.create(
            student=self.student, course=self.course, instructor=self.faculty,
            teaching_quality=5, course_content=4, communication=5, overall_rating=5
        )

        res = self.client_fac.get('/api/feedback/summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        data = res.data
        self.assertEqual(data['total_feedback_count'], 1)
        self.assertEqual(data['overall_average'], 5.0)
        self.assertEqual(data['teaching_quality_average'], 5.0)
        self.assertEqual(data['course_content_average'], 4.0)
