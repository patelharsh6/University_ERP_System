from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AttendanceRecord, Timetable
from .serializers import AttendanceRecordSerializer, TimetableSerializer


class AttendanceListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return AttendanceRecord.objects.filter(student=user).select_related('subject')
        return AttendanceRecord.objects.select_related('student', 'subject').all()

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)


class AttendanceDetailView(generics.RetrieveUpdateAPIView):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]


class TimetableListCreateView(generics.ListCreateAPIView):
    queryset = Timetable.objects.select_related('subject', 'instructor').all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAuthenticated]


class TimetableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAuthenticated]
