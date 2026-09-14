from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import IsFacultyOrAdmin
from .models import CourseFeedback
from .serializers import CourseFeedbackSerializer
from .selectors import get_feedback_summary


class FeedbackSummaryView(APIView):
    """Get anonymous rating aggregates across courses and instructors."""
    permission_classes = [IsFacultyOrAdmin]

    def get(self, request):
        summary = get_feedback_summary(request.user)
        return Response(summary)


class FeedbackListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List feedback (scoped by role) or submit new feedback."""
    queryset = CourseFeedback.objects.select_related('student', 'course').all()
    serializer_class = CourseFeedbackSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'course__instructor'

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class FeedbackDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve feedback (scoped by role) or modify/delete (own/admin)."""
    queryset = CourseFeedback.objects.select_related('student', 'course').all()
    serializer_class = CourseFeedbackSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'course__instructor'
