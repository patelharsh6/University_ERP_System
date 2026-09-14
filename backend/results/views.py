from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin
from .models import ExamResult
from .serializers import ExamResultSerializer
from .filters import ExamResultFilter
from .selectors import get_student_transcript


class TranscriptView(APIView):
    """Retrieve full official academic transcript with SGPA/CGPA calculations."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        target_student = user
        if user.role in ('faculty', 'admin') and 'student_id' in request.query_params:
            from accounts.models import User
            target_student = User.objects.filter(id=request.query_params['student_id']).first() or user
        transcript = get_student_transcript(target_student)
        return Response(transcript)


class ExamResultListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List exam results (students see only own published results) or create (faculty/admin)."""
    queryset = ExamResult.objects.select_related('student', 'subject').all()
    serializer_class = ExamResultSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'student'
    published_only_for_student = True
    filterset_class = ExamResultFilter
    search_fields = ['subject__name', 'subject__code', 'student__first_name', 'student__last_name']
    ordering_fields = ['marks_obtained', 'grade_points', 'created_at']


class ExamResultDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve exam result (students see only own published result) or modify (faculty/admin)."""
    queryset = ExamResult.objects.select_related('student', 'subject').all()
    serializer_class = ExamResultSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'student'
    published_only_for_student = True
