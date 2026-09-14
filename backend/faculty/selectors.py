"""
Data selectors and aggregations for faculty dashboard.
"""
from datetime import datetime
from django.db.models import Count, Q
from courses.models import Course, Enrollment, AssignmentSubmission
from attendance.models import Timetable, AttendanceRecord


def get_faculty_dashboard_summary(faculty_user):
    """
    Returns aggregated metrics for the faculty portal in 4-5 fast queries.
    """
    # 1. Courses taught
    courses_qs = Course.objects.filter(instructor=faculty_user, is_published=True)
    course_ids = courses_qs.values_list('id', flat=True)
    courses_count = courses_qs.count()

    # 2. Total students enrolled
    total_students = Enrollment.objects.filter(course_id__in=course_ids).values('student').distinct().count()

    # 3. Classes scheduled today
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    today_name = days[datetime.now().weekday()]
    todays_classes = Timetable.objects.filter(
        instructor=faculty_user, day=today_name
    ).select_related('subject').order_by('start_time')

    classes_today = []
    for c in todays_classes:
        classes_today.append({
            'id': c.id,
            'subject_name': c.subject.name,
            'subject_code': c.subject.code,
            'start_time': str(c.start_time),
            'end_time': str(c.end_time),
            'room': c.room,
        })

    # 4. Pending ungraded submissions
    ungraded_count = AssignmentSubmission.objects.filter(
        assignment__course_id__in=course_ids,
        status=AssignmentSubmission.Status.PENDING
    ).count()

    # 5. At-risk students (< 75% attendance in faculty's subjects)
    subject_ids = courses_qs.values_list('subject_id', flat=True)
    at_risk_count = 0
    if subject_ids:
        # Check student attendance percentages in these subjects
        att_stats = AttendanceRecord.objects.filter(
            subject_id__in=subject_ids
        ).values('student', 'subject').annotate(
            total=Count('id'),
            present=Count('id', filter=Q(status__in=['present', 'late']))
        )
        at_risk_students = set()
        for stat in att_stats:
            if stat['total'] > 0:
                pct = (stat['present'] / stat['total']) * 100
                if pct < 75.0:
                    at_risk_students.add(stat['student'])
        at_risk_count = len(at_risk_students)

    return {
        'courses_count': courses_count,
        'total_enrolled_students': total_students,
        'classes_today_count': len(classes_today),
        'classes_today': classes_today,
        'pending_grading_count': ungraded_count,
        'at_risk_students_count': at_risk_count,
    }
