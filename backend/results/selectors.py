"""
Selectors and aggregations for student transcripts and academic results.
"""
from collections import defaultdict
from django.db.models import Avg, Sum
from .models import ExamResult


def get_student_transcript(student_user):
    """
    Computes semester-wise SGPA and overall CGPA for a student's published results.
    """
    results = ExamResult.objects.filter(
        student=student_user, is_published=True
    ).select_related('subject').order_by('semester', 'subject__code')

    semesters_map = defaultdict(list)
    total_weighted_points = 0.0
    total_credits = 0

    for r in results:
        sem = r.semester or 'General'
        credits = r.subject.credits if r.subject else 3
        points = r.grade_points
        semesters_map[sem].append({
            'subject_id': r.subject.id if r.subject else None,
            'subject_name': r.subject.name if r.subject else '',
            'subject_code': r.subject.code if r.subject else '',
            'credits': credits,
            'exam_type': r.exam_type,
            'marks_obtained': r.marks_obtained,
            'max_marks': r.max_marks,
            'grade': r.grade,
            'grade_points': r.grade_points,
            'remarks': r.remarks,
        })
        total_weighted_points += (points * credits)
        total_credits += credits

    semester_breakdowns = []
    for sem_name, items in semesters_map.items():
        sem_credits = sum(item['credits'] for item in items)
        sem_weighted = sum(item['grade_points'] * item['credits'] for item in items)
        sgpa = round(sem_weighted / sem_credits, 2) if sem_credits > 0 else 0.0
        semester_breakdowns.append({
            'semester': sem_name,
            'sgpa': sgpa,
            'credits_earned': sem_credits,
            'results': items,
        })

    cgpa = round(total_weighted_points / total_credits, 2) if total_credits > 0 else 0.0

    return {
        'student_name': student_user.get_full_name(),
        'enrollment_id': student_user.enrollment_id or '',
        'cgpa': cgpa,
        'total_credits_earned': total_credits,
        'semesters': semester_breakdowns,
    }
