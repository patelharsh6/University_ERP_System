"""
Selectors and aggregations for attendance summary reports.
"""
from django.db.models import Count, Q
from .models import AttendanceRecord


def get_attendance_summary(user):
    """
    Returns attendance statistics. If student, returns their breakdown;
    if faculty/admin, returns overall subject statistics.
    """
    if user.role == 'student':
        records = AttendanceRecord.objects.filter(student=user)
    else:
        records = AttendanceRecord.objects.all()

    overall = records.aggregate(
        total=Count('id'),
        present=Count('id', filter=Q(status='present')),
        late=Count('id', filter=Q(status='late')),
        absent=Count('id', filter=Q(status='absent')),
        excused=Count('id', filter=Q(status='excused')),
    )
    total = overall['total'] or 0
    effective_present = (overall['present'] or 0) + (overall['late'] or 0)
    percentage = round((effective_present / total) * 100, 1) if total > 0 else 0.0

    subject_breakdowns = []
    stats = records.values(
        'subject__id', 'subject__name', 'subject__code'
    ).annotate(
        total=Count('id'),
        present=Count('id', filter=Q(status__in=['present', 'late'])),
        absent=Count('id', filter=Q(status='absent')),
    ).order_by('subject__code')

    for s in stats:
        s_total = s['total']
        s_present = s['present']
        pct = round((s_present / s_total) * 100, 1) if s_total > 0 else 0.0
        subject_breakdowns.append({
            'subject_id': s['subject__id'],
            'subject_name': s['subject__name'],
            'subject_code': s['subject__code'],
            'total_classes': s_total,
            'attended_classes': s_present,
            'absent_classes': s['absent'],
            'percentage': pct,
            'is_below_threshold': pct < 75.0,
        })

    return {
        'total_records': total,
        'present': overall['present'] or 0,
        'late': overall['late'] or 0,
        'absent': overall['absent'] or 0,
        'excused': overall['excused'] or 0,
        'overall_percentage': percentage,
        'is_below_threshold': percentage < 75.0,
        'subjects': subject_breakdowns,
    }
