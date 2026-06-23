from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StudentProfile, LeaveRequest
from .serializers import (
    StudentProfileSerializer, StudentCreateSerializer, LeaveRequestSerializer
)


class StudentListCreateView(generics.ListCreateAPIView):
    """List all students or create a new student profile."""
    queryset = StudentProfile.objects.select_related('user').all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentProfileSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a student profile."""
    queryset = StudentProfile.objects.select_related('user').all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]


class LeaveRequestListCreateView(generics.ListCreateAPIView):
    """List leave requests or create a new one."""
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return LeaveRequest.objects.filter(student=user)
        return LeaveRequest.objects.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class LeaveRequestDetailView(generics.RetrieveUpdateAPIView):
    """Get or update a leave request (approve/reject)."""
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role in ('faculty', 'admin'):
            serializer.save(reviewed_by=self.request.user)
        else:
            serializer.save()
