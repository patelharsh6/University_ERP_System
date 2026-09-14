import django_filters
from .models import ExamSchedule


class ExamScheduleFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='exam_date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='exam_date', lookup_expr='lte')

    class Meta:
        model = ExamSchedule
        fields = ['exam_type', 'subject', 'semester', 'academic_term', 'hall_ticket_released', 'date_from', 'date_to']
