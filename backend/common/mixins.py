"""
Reusable mixins for DRF generic views.
"""


class RoleScopedQuerysetMixin:
    """
    Mixin that automatically scopes querysets for List and Detail views
    based on the requesting user's role.

    Attributes:
        student_field (str or None): The field name linking the model to the student user.
                                     e.g. 'student', 'user', 'recipient'. Set to None to disable.
        faculty_field (str or None): The field name linking the model to the faculty instructor.
                                     e.g. 'instructor', 'course__instructor'. Set to None to disable.
        published_only_for_student (bool): If True, filters student queries to is_published=True.
    """
    student_field = 'student'
    faculty_field = None
    published_only_for_student = False
    admin_roles = ('admin',)

    def get_queryset(self):
        qs = super().get_queryset()
        user = getattr(self.request, 'user', None)

        if not user or not user.is_authenticated:
            return qs.none()

        if user.role in self.admin_roles or user.is_superuser:
            return qs

        if user.role == 'faculty':
            if self.faculty_field:
                return qs.filter(**{self.faculty_field: user})
            return qs

        if user.role == 'student':
            if self.published_only_for_student and hasattr(qs.model, 'is_published'):
                qs = qs.filter(is_published=True)
            if self.student_field:
                return qs.filter(**{self.student_field: user})
            return qs

        return qs
