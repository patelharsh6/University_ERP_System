import django_filters
from .models import AttendanceRecord, Timetable


class AttendanceFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = AttendanceRecord
        fields = ['subject', 'status', 'student', 'date_from', 'date_to']


class TimetableFilter(django_filters.FilterSet):
    class Meta:
        model = Timetable
        fields = ['day', 'semester', 'department', 'instructor', 'subject']
