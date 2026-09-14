"""
Selectors and aggregations for student feedback summaries.
Never returns student identities.
"""
from django.db.models import Avg, Count
from .models import CourseFeedback


def get_feedback_summary(user):
    """
    Returns anonymous rating aggregates for courses and instructors.
    """
    qs = CourseFeedback.objects.all()
    if user.role == 'faculty':
        qs = qs.filter(course__instructor=user)

    overall = qs.aggregate(
        total_reviews=Count('id'),
        avg_overall=Avg('overall_rating'),
        avg_teaching=Avg('teaching_quality'),
        avg_content=Avg('course_content'),
        avg_communication=Avg('communication'),
    )

    course_breakdown = qs.values(
        'course__id', 'course__title', 'course__code'
    ).annotate(
        total=Count('id'),
        avg_rating=Avg('overall_rating'),
        avg_teaching=Avg('teaching_quality'),
        avg_content=Avg('course_content'),
        avg_communication=Avg('communication'),
    ).order_by('-avg_rating')

    courses_list = []
    for c in course_breakdown:
        courses_list.append({
            'course_id': c['course__id'],
            'course_title': c['course__title'],
            'course_code': c['course__code'],
            'total_feedback_count': c['total'],
            'overall_rating': round(float(c['avg_rating'] or 0.0), 2),
            'teaching_quality': round(float(c['avg_teaching'] or 0.0), 2),
            'course_content': round(float(c['avg_content'] or 0.0), 2),
            'communication': round(float(c['avg_communication'] or 0.0), 2),
        })

    return {
        'total_feedback_count': overall['total_reviews'] or 0,
        'overall_average': round(float(overall['avg_overall'] or 0.0), 2),
        'teaching_quality_average': round(float(overall['avg_teaching'] or 0.0), 2),
        'course_content_average': round(float(overall['avg_content'] or 0.0), 2),
        'communication_average': round(float(overall['avg_communication'] or 0.0), 2),
        'courses': courses_list,
    }
