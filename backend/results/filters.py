import django_filters
from .models import ExamResult


class ExamResultFilter(django_filters.FilterSet):
    class Meta:
        model = ExamResult
        fields = ['subject', 'exam_type', 'semester', 'is_published', 'student']
