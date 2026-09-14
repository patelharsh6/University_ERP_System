"""
Management command to seed realistic, idempotent demo data for University ERP.
Creates 1 Admin, 3 Faculty, 20 Students, Courses, Attendance, Fees, Results,
Announcements, Assignments, Submissions, Clearance, and Calendar events.
"""
from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User, UserPreference
from students.models import StudentProfile, LeaveRequest, ClearanceItem
from faculty.models import FacultyProfile
from courses.models import (
    AcademicTerm, Subject, Course, Enrollment, Assignment,
    AssignmentSubmission, StudyMaterial
)
from attendance.models import AttendanceRecord, Timetable
from fees.models import FeeStructure, FeePayment
from results.models import ExamResult
from announcements.models import Announcement, Notification
from feedback.models import CourseFeedback
from exams.models import ExamSchedule
from calendar_app.models import Holiday
from counselling.models import CounsellingSession


class Command(BaseCommand):
    help = 'Seeds complete, realistic, and idempotent demo data for University ERP.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Beginning demo database seeding...'))

        # 1. Admin User
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@university.edu',
                'first_name': 'System',
                'last_name': 'Administrator',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        UserPreference.objects.get_or_create(user=admin_user, defaults={'theme': 'dark'})

        # 2. Faculty Members
        faculty_data = [
            ('dr.smith', 'smith@university.edu', 'Alan', 'Smith', 'EMP001', 'Computer Science', 'Professor'),
            ('dr.jones', 'jones@university.edu', 'Sarah', 'Jones', 'EMP002', 'Mathematics', 'Associate Professor'),
            ('dr.patel', 'patel@university.edu', 'Raj', 'Patel', 'EMP003', 'Electronics', 'Assistant Professor'),
        ]
        faculty_users = []
        for uname, email, fname, lname, empid, dept, desig in faculty_data:
            fac_user, _ = User.objects.get_or_create(
                username=uname,
                defaults={
                    'email': email,
                    'first_name': fname,
                    'last_name': lname,
                    'role': User.Role.FACULTY,
                    'employee_id': empid,
                }
            )
            fac_user.set_password('faculty123')
            fac_user.save()
            FacultyProfile.objects.get_or_create(
                user=fac_user,
                defaults={
                    'department': dept,
                    'designation': desig,
                    'specialization': f'Advanced {dept}',
                }
            )
            UserPreference.objects.get_or_create(user=fac_user)
            faculty_users.append(fac_user)

        # 3. Academic Term
        current_term, _ = AcademicTerm.objects.get_or_create(
            code='2024-FALL',
            defaults={
                'name': 'Fall 2024 (Semester 3)',
                'start_date': date(2024, 8, 1),
                'end_date': date(2024, 12, 20),
                'is_current': True,
            }
        )

        # 4. Subjects
        subjects_data = [
            ('CS101', 'Introduction to Programming', 'Computer Science', 4, '1st', False),
            ('CS201', 'Data Structures & Algorithms', 'Computer Science', 4, '3rd', False),
            ('CS301', 'Database Management Systems', 'Computer Science', 3, '3rd', False),
            ('MA101', 'Engineering Mathematics', 'Mathematics', 4, '1st', False),
            ('EC101', 'Basic Electronics', 'Electronics', 3, '1st', False),
            ('CS401', 'Artificial Intelligence', 'Computer Science', 3, '3rd', True),
        ]
        subjects = {}
        for code, name, dept, credits, sem, is_elec in subjects_data:
            subj, _ = Subject.objects.get_or_create(
                code=code,
                defaults={
                    'name': name,
                    'department': dept,
                    'credits': credits,
                    'semester': sem,
                    'is_elective': is_elec,
                }
            )
            subjects[code] = subj

        # 5. Courses
        courses_data = [
            ('CS101-C', 'CS101 - Python for Engineers', faculty_users[0], subjects['CS101'], '1st', 'Computer Science'),
            ('CS201-C', 'CS201 - Advanced Data Structures', faculty_users[0], subjects['CS201'], '3rd', 'Computer Science'),
            ('CS301-C', 'CS301 - Relational Database Systems', faculty_users[0], subjects['CS301'], '3rd', 'Computer Science'),
            ('MA101-C', 'MA101 - Calculus & Linear Algebra', faculty_users[1], subjects['MA101'], '1st', 'Mathematics'),
            ('EC101-C', 'EC101 - Circuits & Digital Logic', faculty_users[2], subjects['EC101'], '1st', 'Electronics'),
            ('CS401-C', 'CS401 - Machine Learning Fundamentals', faculty_users[0], subjects['CS401'], '3rd', 'Computer Science'),
        ]
        courses = {}
        for ccode, ctitle, instr, subj, sem, dept in courses_data:
            course, _ = Course.objects.get_or_create(
                code=ccode,
                defaults={
                    'title': ctitle,
                    'instructor': instr,
                    'subject': subj,
                    'semester': sem,
                    'department': dept,
                    'total_chapters': 12,
                    'is_published': True,
                }
            )
            courses[ccode] = course

        # 6. Students (20 students)
        first_names = [
            'Alice', 'Bob', 'Charlie', 'Diana', 'Ethan',
            'Fiona', 'George', 'Hannah', 'Ian', 'Julia',
            'Kevin', 'Laura', 'Michael', 'Nina', 'Oliver',
            'Paula', 'Quinn', 'Rachel', 'Samuel', 'Tina'
        ]
        students = []
        for i, fname in enumerate(first_names, start=1):
            uname = f'student{i:02d}'
            enrollment_id = f'21CS{i:03d}'
            email = f'{uname}@university.edu'
            stu_user, _ = User.objects.get_or_create(
                username=uname,
                defaults={
                    'email': email,
                    'first_name': fname,
                    'last_name': 'Student',
                    'role': User.Role.STUDENT,
                    'enrollment_id': enrollment_id,
                }
            )
            stu_user.set_password('student123')
            stu_user.save()
            StudentProfile.objects.get_or_create(
                user=stu_user,
                defaults={
                    'department': 'Computer Science',
                    'semester': '3rd',
                    'course_name': 'B.Tech (CSE)',
                    'admission_year': 2023,
                    'guardian_name': f'Parent of {fname}',
                    'guardian_phone': '9876543210',
                }
            )
            UserPreference.objects.get_or_create(user=stu_user)
            students.append(stu_user)

        # 7. Enrollments
        for stu in students:
            for c in [courses['CS201-C'], courses['CS301-C'], courses['CS401-C']]:
                Enrollment.objects.get_or_create(
                    student=stu,
                    course=c,
                    defaults={'progress': 45.0}
                )

        # 8. Timetable
        timetable_slots = [
            (subjects['CS201'], faculty_users[0], 'Monday', time(9, 0), time(10, 30), 'Hall 101'),
            (subjects['CS301'], faculty_users[0], 'Monday', time(11, 0), time(12, 30), 'Lab 3'),
            (subjects['CS201'], faculty_users[0], 'Wednesday', time(9, 0), time(10, 30), 'Hall 101'),
            (subjects['CS401'], faculty_users[0], 'Wednesday', time(14, 0), time(15, 30), 'Hall 204'),
            (subjects['CS301'], faculty_users[0], 'Friday', time(10, 0), time(11, 30), 'Lab 3'),
        ]
        for subj, instr, day, st, et, room in timetable_slots:
            Timetable.objects.get_or_create(
                subject=subj,
                day=day,
                start_time=st,
                defaults={
                    'end_time': et,
                    'instructor': instr,
                    'room': room,
                    'semester': '3rd',
                    'department': 'Computer Science',
                }
            )

        # 9. Attendance Records
        base_date = date(2024, 9, 2)
        for d in range(12):
            cur_date = base_date + timedelta(days=d)
            if cur_date.weekday() < 5:  # Weekday
                for i, stu in enumerate(students):
                    status = AttendanceRecord.Status.PRESENT if (i + d) % 6 != 0 else AttendanceRecord.Status.ABSENT
                    AttendanceRecord.objects.get_or_create(
                        student=stu,
                        subject=subjects['CS201'],
                        date=cur_date,
                        defaults={'status': status, 'marked_by': faculty_users[0]}
                    )
                    AttendanceRecord.objects.get_or_create(
                        student=stu,
                        subject=subjects['CS301'],
                        date=cur_date,
                        defaults={'status': AttendanceRecord.Status.PRESENT, 'marked_by': faculty_users[0]}
                    )

        # 10. Fee Structures and Payments
        fee_tuition, _ = FeeStructure.objects.get_or_create(
            name='Semester 3 Tuition Fee',
            academic_year='2024-25',
            defaults={'amount': 45000.00, 'course_name': 'B.Tech (CSE)', 'semester': '3rd'}
        )
        fee_hostel, _ = FeeStructure.objects.get_or_create(
            name='Hostel & Mess Fee (Term 1)',
            academic_year='2024-25',
            defaults={'amount': 25000.00, 'semester': '3rd'}
        )

        for i, stu in enumerate(students):
            # Student 0-10: Fully paid, 11-15: Partial, 16-19: Pending
            if i <= 10:
                paid_amt = 45000.00
                st = FeePayment.Status.PAID
            elif i <= 15:
                paid_amt = 20000.00
                st = FeePayment.Status.PARTIAL
            else:
                paid_amt = 0.00
                st = FeePayment.Status.PENDING

            FeePayment.objects.get_or_create(
                student=stu,
                fee_structure=fee_tuition,
                defaults={
                    'amount_paid': paid_amt,
                    'total_amount': 45000.00,
                    'due_date': date(2024, 11, 30),
                    'status': st,
                    'transaction_id': f'TXN-{stu.enrollment_id}-01' if paid_amt > 0 else '',
                }
            )

        # 11. Exam Results
        for i, stu in enumerate(students):
            score = 65 + (i * 1.5)  # 65 to 93.5
            ExamResult.objects.get_or_create(
                student=stu,
                subject=subjects['CS201'],
                exam_type='midterm',
                defaults={
                    'semester': '3rd',
                    'marks_obtained': min(score, 98.0),
                    'max_marks': 100.0,
                    'is_published': True,
                    'published_at': timezone.now(),
                }
            )
            # Add an unpublished quiz result
            ExamResult.objects.get_or_create(
                student=stu,
                subject=subjects['CS301'],
                exam_type='quiz',
                defaults={
                    'semester': '3rd',
                    'marks_obtained': 18.0,
                    'max_marks': 20.0,
                    'is_published': False,
                }
            )

        # 12. Announcements & Notifications
        ann1, _ = Announcement.objects.get_or_create(
            title='Mid-Semester Examination Schedule Published',
            defaults={
                'content': 'The timetable for the upcoming mid-semester examinations has been posted. Please review dates and hall numbers.',
                'author': faculty_users[0],
                'priority': Announcement.Priority.HIGH,
                'target_audience': Announcement.TargetAudience.ALL,
                'is_pinned': True,
                'is_active': True,
            }
        )
        ann2, _ = Announcement.objects.get_or_create(
            title='Annual Hackathon 2024 Registrations Open',
            defaults={
                'content': 'Teams of 2-4 members can submit proposals for the University Innovation Hackathon by end of the month.',
                'author': admin_user,
                'priority': Announcement.Priority.MEDIUM,
                'target_audience': Announcement.TargetAudience.STUDENTS,
                'is_active': True,
            }
        )

        for stu in students[:5]:
            Notification.objects.get_or_create(
                recipient=stu,
                title='Midterm Hall Ticket Ready',
                defaults={
                    'message': 'Your hall ticket for Midterm Examinations is available for download.',
                    'notification_type': 'info',
                    'is_read': False,
                }
            )

        # 13. Assignments & Submissions
        assign1, _ = Assignment.objects.get_or_create(
            course=courses['CS201-C'],
            title='Problem Set 1: Graph Traversal and Dijkstra',
            defaults={
                'description': 'Implement Dijkstra algorithm in Python and submit the source script.',
                'due_date': timezone.now() + timedelta(days=7),
                'max_marks': 50,
            }
        )
        assign2, _ = Assignment.objects.get_or_create(
            course=courses['CS301-C'],
            title='Lab Assignment 2: SQL Normalization & Indexing',
            defaults={
                'description': 'Submit SQL DDL and query execution plans for the bookstore schema.',
                'due_date': timezone.now() + timedelta(days=12),
                'max_marks': 30,
            }
        )

        for stu in students[:10]:
            AssignmentSubmission.objects.get_or_create(
                assignment=assign1,
                student=stu,
                defaults={
                    'submission_text': 'https://github.com/student-demo/dijkstra-impl',
                    'status': AssignmentSubmission.Status.GRADED,
                    'marks_obtained': 46.0,
                    'feedback': 'Excellent implementation and clean test coverage.',
                    'graded_by': faculty_users[0],
                    'graded_at': timezone.now(),
                }
            )

        # 14. Exam Schedules
        ExamSchedule.objects.get_or_create(
            subject=subjects['CS201'],
            exam_type='endterm',
            exam_date=date(2024, 12, 10),
            defaults={
                'start_time': time(9, 30),
                'end_time': time(12, 30),
                'venue': 'Examination Hall A',
                'semester': '3rd',
                'academic_term': current_term,
                'hall_ticket_released': True,
            }
        )
        ExamSchedule.objects.get_or_create(
            subject=subjects['CS301'],
            exam_type='endterm',
            exam_date=date(2024, 12, 12),
            defaults={
                'start_time': time(9, 30),
                'end_time': time(12, 30),
                'venue': 'Examination Hall B',
                'semester': '3rd',
                'academic_term': current_term,
                'hall_ticket_released': True,
            }
        )

        # 15. Holidays / Academic Calendar
        holidays_data = [
            ('Gandhi Jayanti', date(2024, 10, 2), None, 'holiday'),
            ('Dussehra Break', date(2024, 10, 11), date(2024, 10, 14), 'vacation'),
            ('Diwali Vacation', date(2024, 10, 31), date(2024, 11, 4), 'vacation'),
            ('University Tech Fest', date(2024, 11, 15), date(2024, 11, 16), 'event'),
            ('End-Semester Examinations', date(2024, 12, 10), date(2024, 12, 22), 'exam'),
        ]
        for htitle, hdate, hend, cat in holidays_data:
            Holiday.objects.get_or_create(
                title=htitle,
                date=hdate,
                defaults={'end_date': hend, 'category': cat}
            )

        # 16. Clearance Items
        departments = ['Library', 'Hostel', 'Accounts', 'Laboratory', 'Sports']
        for stu in students[:8]:
            for dept in departments:
                ClearanceItem.objects.get_or_create(
                    student=stu,
                    department=dept,
                    defaults={'status': ClearanceItem.Status.CLEARED, 'cleared_by': admin_user}
                )

        # 17. Counselling Sessions
        for stu in students[:3]:
            CounsellingSession.objects.get_or_create(
                student=stu,
                counsellor=faculty_users[0],
                slot_start=timezone.now() + timedelta(days=2),
                defaults={
                    'slot_end': timezone.now() + timedelta(days=2, hours=1),
                    'mode': CounsellingSession.Mode.IN_PERSON,
                    'status': CounsellingSession.Status.SCHEDULED,
                    'student_concern': 'Career guidance regarding Artificial Intelligence electives.',
                    'private_notes': 'Motivated student. Recommended reading research papers on LLMs.',
                }
            )

        self.stdout.write(self.style.SUCCESS(
            'Demo database seeded successfully!\n'
            'Admin: admin / admin123\n'
            'Faculty: dr.smith, dr.jones, dr.patel / faculty123\n'
            'Students: student01 to student20 / student123'
        ))
