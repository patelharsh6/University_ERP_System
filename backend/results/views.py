from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ExamResult
from .serializers import ExamResultSerializer


class ExamResultListCreateView(generics.ListCreateAPIView):
    serializer_class = ExamResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return ExamResult.objects.filter(
                student=user, is_published=True
            ).select_related('subject')
        return ExamResult.objects.select_related('student', 'subject').all()

    def perform_create(self, serializer):
        serializer.save()


class ExamResultDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExamResult.objects.all()
    serializer_class = ExamResultSerializer
    permission_classes = [IsAuthenticated]
