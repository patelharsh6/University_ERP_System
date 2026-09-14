from rest_framework import generics
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin
from .models import ExamResult
from .serializers import ExamResultSerializer


class ExamResultListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List exam results (students see only own published results) or create (faculty/admin)."""
    queryset = ExamResult.objects.select_related('student', 'subject').all()
    serializer_class = ExamResultSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'student'
    published_only_for_student = True


class ExamResultDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve exam result (students see only own published result) or modify (faculty/admin)."""
    queryset = ExamResult.objects.select_related('student', 'subject').all()
    serializer_class = ExamResultSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'student'
    published_only_for_student = True
