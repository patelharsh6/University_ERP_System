from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from common.permissions import ReadOnlyOrFacultyAdmin, IsFaculty
from .models import FacultyProfile
from .serializers import FacultyProfileSerializer, FacultyCreateSerializer
from .filters import FacultyProfileFilter
from .selectors import get_faculty_dashboard_summary


class FacultyListCreateView(generics.ListCreateAPIView):
    """List all faculty or create a new faculty profile (faculty/admin only for write)."""
    queryset = FacultyProfile.objects.select_related('user').all()
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = FacultyProfileFilter
    search_fields = ['user__first_name', 'user__last_name', 'user__employee_id', 'department', 'designation', 'specialization']
    ordering_fields = ['joining_date', 'department', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FacultyCreateSerializer
        return FacultyProfileSerializer

    def perform_create(self, serializer):
        target_user = serializer.validated_data.get('user', self.request.user)
        serializer.save(user=target_user)


class FacultyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a faculty profile."""
    queryset = FacultyProfile.objects.select_related('user').all()
    serializer_class = FacultyProfileSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]


class FacultyDashboardSummaryView(APIView):
    """Aggregated teaching, classes today, grading, and at-risk metrics for faculty."""
    permission_classes = [IsFaculty]

    def get(self, request):
        summary = get_faculty_dashboard_summary(request.user)
        return Response(summary)
