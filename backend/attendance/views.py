from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin
from .models import AttendanceRecord, Timetable
from .serializers import AttendanceRecordSerializer, TimetableSerializer
from .filters import AttendanceFilter, TimetableFilter
from .selectors import get_attendance_summary


class AttendanceSummaryView(APIView):
    """Get summarized attendance analytics and subject breakdown."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        summary = get_attendance_summary(request.user)
        return Response(summary)


class AttendanceListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List attendance (scoped to student) or mark attendance (faculty/admin only)."""
    queryset = AttendanceRecord.objects.select_related('student', 'subject', 'marked_by').all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'student'
    filterset_class = AttendanceFilter
    search_fields = ['student__first_name', 'student__last_name', 'subject__code', 'subject__name']
    ordering_fields = ['date', 'status']

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)


class AttendanceDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve attendance record (scoped) or update/delete (faculty/admin only)."""
    queryset = AttendanceRecord.objects.select_related('student', 'subject', 'marked_by').all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'student'


class TimetableListCreateView(generics.ListCreateAPIView):
    """List timetable entries or create new ones (faculty/admin only)."""
    queryset = Timetable.objects.select_related('subject', 'instructor').all()
    serializer_class = TimetableSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = TimetableFilter
    search_fields = ['subject__code', 'subject__name', 'instructor__first_name', 'instructor__last_name', 'room']
    ordering_fields = ['day', 'start_time']


class TimetableDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a timetable entry (faculty/admin only)."""
    queryset = Timetable.objects.select_related('subject', 'instructor').all()
    serializer_class = TimetableSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
