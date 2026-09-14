from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin, IsFacultyOrAdmin
from .models import StudentProfile, LeaveRequest
from .serializers import (
    StudentProfileSerializer, StudentCreateSerializer, LeaveRequestSerializer
)


class StudentListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List student profiles or create a new student profile."""
    queryset = StudentProfile.objects.select_related('user').all()
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'user'

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentProfileSerializer

    def perform_create(self, serializer):
        # If user is provided by admin, use it, else attach requesting user
        target_user = serializer.validated_data.get('user', self.request.user)
        serializer.save(user=target_user)


class StudentDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a student profile."""
    queryset = StudentProfile.objects.select_related('user').all()
    serializer_class = StudentProfileSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'user'


class LeaveRequestListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List leave requests or create a new one."""
    queryset = LeaveRequest.objects.select_related('student', 'reviewed_by').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'

    def perform_create(self, serializer):
        serializer.save(student=self.request.user, status=LeaveRequest.Status.PENDING)


class LeaveRequestDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateAPIView):
    """Get or update a leave request (students cannot self-approve)."""
    queryset = LeaveRequest.objects.select_related('student', 'reviewed_by').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'

    def perform_update(self, serializer):
        user = self.request.user
        if user.role == 'student':
            instance = serializer.instance
            new_status = serializer.validated_data.get('status', instance.status)
            if new_status != instance.status:
                raise serializers.ValidationError({
                    'status': 'Students are not permitted to approve or alter leave status.'
                })
            serializer.save()
        else:
            serializer.save(reviewed_by=user)
