from rest_framework import generics
from common.permissions import ReadOnlyOrFacultyAdmin
from .models import ExamSchedule
from .serializers import ExamScheduleSerializer
from .filters import ExamScheduleFilter


class ExamScheduleListCreateView(generics.ListCreateAPIView):
    """List exam schedules (all authenticated) or create (faculty/admin only)."""
    queryset = ExamSchedule.objects.select_related('subject', 'academic_term').all()
    serializer_class = ExamScheduleSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = ExamScheduleFilter
    search_fields = ['subject__name', 'subject__code', 'venue']
    ordering_fields = ['exam_date', 'start_time']


class ExamScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve exam schedule or modify (faculty/admin only)."""
    queryset = ExamSchedule.objects.select_related('subject', 'academic_term').all()
    serializer_class = ExamScheduleSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
