from django.utils import timezone
from rest_framework import generics, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin, IsFacultyOrAdmin
from .models import StudentProfile, LeaveRequest, ClearanceItem
from .serializers import (
    StudentProfileSerializer, StudentCreateSerializer,
    LeaveRequestSerializer, ClearanceItemSerializer
)
from .filters import StudentProfileFilter, LeaveRequestFilter, ClearanceItemFilter
from .selectors import get_student_dashboard_summary


class StudentListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List student profiles or create a new student profile."""
    queryset = StudentProfile.objects.select_related('user').all()
    serializer_class = StudentProfileSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'user'
    filterset_class = StudentProfileFilter
    search_fields = ['user__first_name', 'user__last_name', 'user__enrollment_id', 'department', 'course_name']
    ordering_fields = ['admission_year', 'created_at', 'semester']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentProfileSerializer

    def perform_create(self, serializer):
        target_user = serializer.validated_data.get('user', self.request.user)
        serializer.save(user=target_user)


class StudentDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a student profile."""
    queryset = StudentProfile.objects.select_related('user').all()
    serializer_class = StudentProfileSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    student_field = 'user'


class StudentDashboardSummaryView(APIView):
    """Returns aggregated attendance, GPA, fee balance, and deadlines for current student."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        summary = get_student_dashboard_summary(request.user)
        return Response(summary)


class LeaveRequestListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List leave requests or create a new one."""
    queryset = LeaveRequest.objects.select_related('student', 'reviewed_by').all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    filterset_class = LeaveRequestFilter
    search_fields = ['reason', 'student__first_name', 'student__last_name']
    ordering_fields = ['start_date', 'end_date', 'created_at']

    def perform_create(self, serializer):
        serializer.save(student=self.request.user, status=LeaveRequest.Status.PENDING)


class LeaveRequestDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or cancel a leave request."""
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


class ClearanceItemListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List clearance items (scoped to student) or create (faculty/admin only)."""
    queryset = ClearanceItem.objects.select_related('student', 'cleared_by').all()
    serializer_class = ClearanceItemSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    filterset_class = ClearanceItemFilter
    search_fields = ['department', 'remarks']
    ordering_fields = ['department', 'status', 'cleared_at']

    def perform_create(self, serializer):
        if self.request.user.role not in ('faculty', 'admin'):
            raise serializers.ValidationError({
                'error': 'Students cannot create clearance items.'
            })
        serializer.save()


class ClearanceItemDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve or clear/update a clearance item (faculty/admin for updates)."""
    queryset = ClearanceItem.objects.select_related('student', 'cleared_by').all()
    serializer_class = ClearanceItemSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'

    def perform_update(self, serializer):
        user = self.request.user
        if user.role not in ('faculty', 'admin'):
            raise serializers.ValidationError({
                'error': 'Only faculty or admin can update clearance status.'
            })
        new_status = serializer.validated_data.get('status')
        if new_status == ClearanceItem.Status.CLEARED:
            serializer.save(cleared_by=user, cleared_at=timezone.now())
        else:
            serializer.save()
