import django_filters
from .models import FacultyProfile


class FacultyProfileFilter(django_filters.FilterSet):
    class Meta:
        model = FacultyProfile
        fields = ['department', 'designation']
