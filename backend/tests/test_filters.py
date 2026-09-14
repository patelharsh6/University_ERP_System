"""
Tests for query parameter filtering, search, and ordering (B3).
"""
from datetime import date, time
from django.test import TestCase
from rest_framework import status
from courses.models import Subject, Course
from attendance.models import Timetable
from fees.models import FeeStructure, FeePayment
from results.models import ExamResult
from tests.factories import create_student, create_faculty, create_admin, get_auth_client


class FiltersAndSearchTests(TestCase):

    def setUp(self):
        self.student, self.profile = create_student(
            username='stu_filter', email='filter@university.edu', enrollment_id='21CS088',
            department='Computer Science', semester='3rd', course_name='B.Tech (CSE)'
        )
        self.faculty, _ = create_faculty(
            username='fac_filter', email='fac_filt@university.edu', employee_id='EMP888',
            department='Computer Science'
        )
        self.admin = create_admin(username='adm_filter', email='adm_filt@university.edu')

        self.client_stu = get_auth_client(self.student)
        self.client_admin = get_auth_client(self.admin)

        self.subj1 = Subject.objects.create(name='Automata', code='CS307', department='Computer Science', semester='3rd')
        self.subj2 = Subject.objects.create(name='VLSI Design', code='EC301', department='Electronics', semester='3rd')

        # Timetable
        Timetable.objects.create(
            subject=self.subj1, day='Tuesday', start_time=time(10, 0), end_time=time(11, 30),
            department='Computer Science', semester='3rd'
        )
        Timetable.objects.create(
            subject=self.subj2, day='Thursday', start_time=time(14, 0), end_time=time(15, 30),
            department='Electronics', semester='3rd'
        )

        # Fees
        struct = FeeStructure.objects.create(name='Tuition', amount=40000, academic_year='2024-25')
        FeePayment.objects.create(
            student=self.student, fee_structure=struct, amount_paid=40000, total_amount=40000,
            status=FeePayment.Status.PAID, due_date=date(2024, 10, 1)
        )
        FeePayment.objects.create(
            student=self.student, fee_structure=struct, amount_paid=0, total_amount=40000,
            status=FeePayment.Status.PENDING, due_date=date(2029, 11, 1)
        )

    def test_filter_students_by_department(self):
        """Admin filters students by department and semester."""
        res = self.client_admin.get('/api/students/?department=Computer+Science&semester=3rd')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res.data['count'], 1)

        res_none = self.client_admin.get('/api/students/?department=Mechanical')
        self.assertEqual(res_none.status_code, status.HTTP_200_OK)
        self.assertEqual(res_none.data['count'], 0)

    def test_filter_timetable_by_day(self):
        """Filter weekly timetable by day."""
        res = self.client_stu.get('/api/attendance/timetable/?day=Tuesday')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['results'][0]['subject_name'], 'Automata')

    def test_filter_fees_by_status(self):
        """Filter fee payments by status."""
        res_paid = self.client_stu.get('/api/fees/?status=paid')
        self.assertEqual(res_paid.status_code, status.HTTP_200_OK)
        self.assertEqual(res_paid.data['count'], 1)

        res_pend = self.client_stu.get('/api/fees/?status=pending')
        self.assertEqual(res_pend.status_code, status.HTTP_200_OK)
        self.assertEqual(res_pend.data['count'], 1)

    def test_search_subjects_by_code(self):
        """Search subjects by exact or partial code."""
        res = self.client_stu.get('/api/courses/subjects/?search=CS307')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], 1)
        self.assertEqual(res.data['results'][0]['name'], 'Automata')
