import django_filters
from .models import FeePayment, FeeStructure


class FeePaymentFilter(django_filters.FilterSet):
    due_before = django_filters.DateFilter(field_name='due_date', lookup_expr='lte')
    academic_year = django_filters.CharFilter(field_name='fee_structure__academic_year')

    class Meta:
        model = FeePayment
        fields = ['status', 'academic_year', 'due_before', 'student']


class FeeStructureFilter(django_filters.FilterSet):
    class Meta:
        model = FeeStructure
        fields = ['course_name', 'semester', 'academic_year']
