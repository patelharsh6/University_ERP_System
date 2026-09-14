"""
Data selectors and aggregations for student dashboard and performance analysis.
"""
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from attendance.models import AttendanceRecord
from courses.models import Course, Enrollment, Assignment, AssignmentSubmission
from fees.models import FeePayment
from results.models import ExamResult
from announcements.models import Notification


def get_student_dashboard_summary(student_user):
    """
    Returns unified summary data for the student dashboard in 4-5 fast queries.
    """
    now = timezone.now()

    # 1. Attendance breakdown
    att_qs = AttendanceRecord.objects.filter(student=student_user)
    att_agg = att_qs.aggregate(
        total=Count('id'),
        present=Count('id', filter=Q(status__in=['present', 'late']))
    )
    total_classes = att_agg['total'] or 0
    present_classes = att_agg['present'] or 0
    overall_attendance = round((present_classes / total_classes) * 100, 1) if total_classes > 0 else 0.0

    # Per-subject attendance
    subject_attendance = []
    subject_stats = att_qs.values(
        'subject__name', 'subject__code'
    ).annotate(
        total=Count('id'),
        present=Count('id', filter=Q(status__in=['present', 'late']))
    )
    for stat in subject_stats:
        s_total = stat['total']
        s_present = stat['present']
        pct = round((s_present / s_total) * 100, 1) if s_total > 0 else 0.0
        subject_attendance.append({
            'subject_name': stat['subject__name'],
            'subject_code': stat['subject__code'],
            'total': s_total,
            'present': s_present,
            'percentage': pct,
            'is_below_threshold': pct < 75.0,
        })

    # 2. Academic Performance (GPA)
    results_agg = ExamResult.objects.filter(
        student=student_user, is_published=True
    ).aggregate(
        gpa=Avg('grade_points'),
        total_exams=Count('id')
    )
    current_gpa = round(float(results_agg['gpa'] or 0.0), 2)

    # 3. Financial Summary
    fees_qs = FeePayment.objects.filter(student=student_user)
    fee_agg = fees_qs.aggregate(
        total_billed=Sum('total_amount'),
        total_paid=Sum('amount_paid'),
    )
    total_billed = float(fee_agg['total_billed'] or 0.0)
    total_paid = float(fee_agg['total_paid'] or 0.0)
    fee_balance = max(0.0, total_billed - total_paid)

    next_pending_fee = fees_qs.filter(
        status__in=['pending', 'partial', 'overdue']
    ).order_by('due_date').first()
    next_due_date = str(next_pending_fee.due_date) if next_pending_fee else None

    # 4. Upcoming Deadlines (Unsubmitted assignments)
    enrolled_courses = Enrollment.objects.filter(
        student=student_user
    ).values_list('course_id', flat=True)

    submitted_assignments = AssignmentSubmission.objects.filter(
        student=student_user
    ).values_list('assignment_id', flat=True)

    upcoming_deadlines = []
    assignments = Assignment.objects.filter(
        course_id__in=enrolled_courses,
        due_date__gte=now
    ).exclude(
        id__in=submitted_assignments
    ).select_related('course').order_by('due_date')[:5]

    for a in assignments:
        upcoming_deadlines.append({
            'id': a.id,
            'title': a.title,
            'course_title': a.course.title,
            'course_code': a.course.code,
            'due_date': str(a.due_date),
            'max_marks': a.max_marks,
        })

    # 5. Unread Notifications Count
    unread_notifications = Notification.objects.filter(
        recipient=student_user, is_read=False
    ).count()

    return {
        'attendance': {
            'overall_percentage': overall_attendance,
            'total_classes': total_classes,
            'present_classes': present_classes,
            'is_below_threshold': overall_attendance < 75.0,
            'subjects': subject_attendance,
        },
        'academics': {
            'gpa': current_gpa,
            'total_exams_published': results_agg['total_exams'] or 0,
        },
        'fees': {
            'total_billed': total_billed,
            'total_paid': total_paid,
            'balance': fee_balance,
            'next_due_date': next_due_date,
        },
        'deadlines': upcoming_deadlines,
        'unread_notifications': unread_notifications,
    }
