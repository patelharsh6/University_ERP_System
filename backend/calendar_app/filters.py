import django_filters
from .models import Holiday


class HolidayFilter(django_filters.FilterSet):
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Holiday
        fields = ['category', 'department', 'date_from', 'date_to']
