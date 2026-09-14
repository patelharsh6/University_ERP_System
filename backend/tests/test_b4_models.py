"""
Tests for new domain models and endpoints introduced in Stage B4:
- AssignmentSubmission
- ExamSchedule
- Holiday
- ClearanceItem
- CounsellingSession
- UserPreference
"""
from datetime import date, time, timedelta
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from accounts.models import UserPreference
from courses.models import Subject, Course, Assignment, AssignmentSubmission, AcademicTerm
from exams.models import ExamSchedule
from calendar_app.models import Holiday
from students.models import ClearanceItem
from counselling.models import CounsellingSession
from tests.factories import create_student, create_faculty, create_admin, get_auth_client


class B4ModelsTests(TestCase):

    def setUp(self):
        self.student, self.student_profile = create_student(
            username='charlie', email='charlie@university.edu', enrollment_id='21CS005'
        )
        self.faculty, self.faculty_profile = create_faculty(
            username='profdavis', email='davis@university.edu', employee_id='EMP301'
        )
        self.admin = create_admin(username='bossadmin', email='bossadmin@university.edu')

        self.client_stu = get_auth_client(self.student)
        self.client_fac = get_auth_client(self.faculty)
        self.client_admin = get_auth_client(self.admin)

        self.subject = Subject.objects.create(
            name='Operating Systems', code='CS302', department='Computer Science', credits=4, semester='4th'
        )
        self.course = Course.objects.create(
            title='Operating Systems Lab', code='CS302-L', instructor=self.faculty,
            subject=self.subject, semester='4th', is_published=True
        )

    def test_assignment_submission_lifecycle(self):
        """Student submits assignment, faculty grades it, and late flag is computed."""
        # Due in future
        assignment = Assignment.objects.create(
            course=self.course, title='Process Scheduling Lab',
            due_date=timezone.now() + timedelta(days=3), max_marks=50
        )

        # Student submits
        res_sub = self.client_stu.post('/api/courses/submissions/', {
            'assignment': assignment.pk,
            'submission_text': 'Completed round robin algorithm implementation.',
        })
        self.assertEqual(res_sub.status_code, status.HTTP_201_CREATED)
        sub_id = res_sub.data['id']
        sub = AssignmentSubmission.objects.get(id=sub_id)
        self.assertFalse(sub.is_late)
        self.assertEqual(sub.status, AssignmentSubmission.Status.PENDING)

        # Student cannot grade themselves
        res_tamper = self.client_stu.patch(f'/api/courses/submissions/{sub_id}/', {
            'marks_obtained': 50.0,
        })
        sub.refresh_from_db()
        self.assertIsNone(sub.marks_obtained)

        # Faculty grades the submission
        res_grade = self.client_fac.patch(f'/api/courses/submissions/{sub_id}/', {
            'marks_obtained': 48.0,
            'feedback': 'Great logic and test cases.',
        })
        self.assertEqual(res_grade.status_code, status.HTTP_200_OK)
        sub.refresh_from_db()
        self.assertEqual(sub.marks_obtained, 48.0)
        self.assertEqual(sub.status, AssignmentSubmission.Status.GRADED)
        self.assertEqual(sub.graded_by, self.faculty)

    def test_exam_schedule_crud(self):
        """Exam schedule listing for students and management by faculty/admin."""
        term = AcademicTerm.objects.create(
            name='Spring 2025', code='2025-SP', start_date=date(2025, 1, 10), end_date=date(2025, 5, 20)
        )
        res_create = self.client_fac.post('/api/exams/schedule/', {
            'subject': self.subject.pk,
            'exam_type': 'endterm',
            'exam_date': '2025-05-15',
            'start_time': '10:00:00',
            'end_time': '13:00:00',
            'venue': 'Auditorium Hall',
            'academic_term': term.pk,
            'hall_ticket_released': True,
        })
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)

        # Student reads schedule
        res_list = self.client_stu.get('/api/exams/schedule/')
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        self.assertEqual(res_list.data['count'], 1)

    def test_holiday_listing(self):
        """Holiday calendar listing and category filtering."""
        Holiday.objects.create(title='Spring Break', date=date(2025, 3, 15), category='vacation')
        Holiday.objects.create(title='Midterm Window', date=date(2025, 3, 1), category='exam')

        res = self.client_stu.get('/api/calendar/holidays/?category=vacation')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['results'][0]['title'], 'Spring Break')

    def test_clearance_item_approval(self):
        """Clearance item management and approval by staff."""
        clearance = ClearanceItem.objects.create(
            student=self.student, department='Library', status=ClearanceItem.Status.PENDING
        )
        # Student cannot approve
        res_stu = self.client_stu.patch(f'/api/students/clearance/{clearance.pk}/', {
            'status': 'cleared'
        })
        self.assertEqual(res_stu.status_code, status.HTTP_400_BAD_REQUEST)

        # Admin approves
        res_admin = self.client_admin.patch(f'/api/students/clearance/{clearance.pk}/', {
            'status': 'cleared'
        })
        self.assertEqual(res_admin.status_code, status.HTTP_200_OK)
        clearance.refresh_from_db()
        self.assertEqual(clearance.status, ClearanceItem.Status.CLEARED)
        self.assertEqual(clearance.cleared_by, self.admin)

    def test_counselling_session_privacy(self):
        """Counselling session hides private notes from student."""
        session = CounsellingSession.objects.create(
            student=self.student, counsellor=self.faculty,
            slot_start=timezone.now() + timedelta(days=1),
            slot_end=timezone.now() + timedelta(days=1, hours=1),
            student_concern='Academic stress',
            private_notes='Confidential: Recommended mindfulness and tutoring.',
        )

        # Student retrieval: private_notes must be omitted
        res_stu = self.client_stu.get(f'/api/counselling/sessions/{session.pk}/')
        self.assertEqual(res_stu.status_code, status.HTTP_200_OK)
        self.assertNotIn('private_notes', res_stu.data)

        # Faculty retrieval: private_notes must be present
        res_fac = self.client_fac.get(f'/api/counselling/sessions/{session.pk}/')
        self.assertEqual(res_fac.status_code, status.HTTP_200_OK)
        self.assertIn('private_notes', res_fac.data)

    def test_user_preference_persistence(self):
        """User preferences can be retrieved and updated."""
        res_get = self.client_stu.get('/api/auth/preferences/')
        self.assertEqual(res_get.status_code, status.HTTP_200_OK)
        self.assertEqual(res_get.data['theme'], 'system')

        res_patch = self.client_stu.patch('/api/auth/preferences/', {
            'theme': 'dark',
            'sidebar_collapsed': True,
        })
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data['theme'], 'dark')
        self.assertTrue(res_patch.data['sidebar_collapsed'])
