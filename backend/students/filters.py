import django_filters
from .models import StudentProfile, LeaveRequest, ClearanceItem


class StudentProfileFilter(django_filters.FilterSet):
    class Meta:
        model = StudentProfile
        fields = ['semester', 'department', 'course_name', 'admission_year', 'is_enrolled']


class LeaveRequestFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='start_date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='end_date', lookup_expr='lte')

    class Meta:
        model = LeaveRequest
        fields = ['status', 'leave_type', 'date_from', 'date_to']


class ClearanceItemFilter(django_filters.FilterSet):
    class Meta:
        model = ClearanceItem
        fields = ['status', 'department', 'student']
