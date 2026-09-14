"""
Data selectors and aggregations for accounts and administrative dashboard.
"""
from django.db.models import Sum, Count, Q
from .models import User
from courses.models import Course, Enrollment
from attendance.models import AttendanceRecord
from fees.models import FeePayment


def get_admin_dashboard_summary():
    """
    Returns aggregated university metrics for the admin dashboard in 4-5 fast queries.
    """
    # Headcounts
    user_counts = User.objects.filter(is_active_account=True).aggregate(
        students=Count('id', filter=Q(role='student')),
        faculty=Count('id', filter=Q(role='faculty')),
        admins=Count('id', filter=Q(role='admin')),
        total=Count('id'),
    )

    # Academics
    course_count = Course.objects.filter(is_published=True).count()
    enrollment_count = Enrollment.objects.count()

    # Financials
    fee_agg = FeePayment.objects.aggregate(
        total_billed=Sum('total_amount'),
        total_collected=Sum('amount_paid'),
    )
    total_billed = float(fee_agg['total_billed'] or 0)
    total_collected = float(fee_agg['total_collected'] or 0)
    outstanding_balance = max(0.0, total_billed - total_collected)

    # Attendance overall
    att_agg = AttendanceRecord.objects.aggregate(
        total=Count('id'),
        present=Count('id', filter=Q(status__in=['present', 'late'])),
    )
    total_att = att_agg['total'] or 0
    present_att = att_agg['present'] or 0
    attendance_rate = round((present_att / total_att) * 100, 1) if total_att > 0 else 0.0

    return {
        'headcount': {
            'students': user_counts['students'] or 0,
            'faculty': user_counts['faculty'] or 0,
            'admins': user_counts['admins'] or 0,
            'total_users': user_counts['total'] or 0,
        },
        'academics': {
            'active_courses': course_count,
            'total_enrollments': enrollment_count,
        },
        'finances': {
            'total_billed': total_billed,
            'total_collected': total_collected,
            'outstanding_balance': outstanding_balance,
        },
        'attendance': {
            'overall_attendance_percentage': attendance_rate,
            'total_records_marked': total_att,
        }
    }
