from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from .models import CounsellingSession
from .serializers import CounsellingSessionSerializer


class CounsellingSessionListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List counselling sessions (scoped to student/counsellor) or request a new session."""
    queryset = CounsellingSession.objects.select_related('student', 'counsellor').all()
    serializer_class = CounsellingSessionSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'counsellor'

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'student':
            serializer.save(student=user)
        else:
            serializer.save()


class CounsellingSessionDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or cancel a counselling session."""
    queryset = CounsellingSession.objects.select_related('student', 'counsellor').all()
    serializer_class = CounsellingSessionSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'counsellor'
