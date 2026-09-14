import django_filters
from .models import Subject, Course, Assignment, AssignmentSubmission, StudyMaterial


class SubjectFilter(django_filters.FilterSet):
    class Meta:
        model = Subject
        fields = ['semester', 'department', 'is_elective']


class CourseFilter(django_filters.FilterSet):
    class Meta:
        model = Course
        fields = ['semester', 'department', 'instructor', 'is_published']


class AssignmentFilter(django_filters.FilterSet):
    due_before = django_filters.DateTimeFilter(field_name='due_date', lookup_expr='lte')
    due_after = django_filters.DateTimeFilter(field_name='due_date', lookup_expr='gte')

    class Meta:
        model = Assignment
        fields = ['course', 'due_before', 'due_after']


class AssignmentSubmissionFilter(django_filters.FilterSet):
    class Meta:
        model = AssignmentSubmission
        fields = ['assignment', 'status', 'is_late', 'student']


class StudyMaterialFilter(django_filters.FilterSet):
    class Meta:
        model = StudyMaterial
        fields = ['course', 'material_type']
