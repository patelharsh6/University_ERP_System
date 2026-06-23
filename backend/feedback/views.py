from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CourseFeedback
from .serializers import CourseFeedbackSerializer


class FeedbackListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseFeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return CourseFeedback.objects.filter(student=user).select_related('course')
        return CourseFeedback.objects.select_related('student', 'course').all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CourseFeedback.objects.all()
    serializer_class = CourseFeedbackSerializer
    permission_classes = [IsAuthenticated]
