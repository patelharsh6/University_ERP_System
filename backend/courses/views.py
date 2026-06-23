from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Subject, Course, Enrollment, Assignment, StudyMaterial
from .serializers import (
    SubjectSerializer, CourseSerializer, EnrollmentSerializer,
    AssignmentSerializer, StudyMaterialSerializer,
)


# ─── Subject views ──────────────────────────────────────────────────────────────
class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]


# ─── Course views ───────────────────────────────────────────────────────────────
class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.select_related('instructor', 'subject').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.select_related('instructor', 'subject').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# ─── Enrollment views ──────────────────────────────────────────────────────────
class EnrollmentListCreateView(generics.ListCreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Enrollment.objects.filter(student=user).select_related('course')
        return Enrollment.objects.select_related('course', 'student').all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# ─── Assignment views ──────────────────────────────────────────────────────────
class AssignmentListCreateView(generics.ListCreateAPIView):
    queryset = Assignment.objects.select_related('course').all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.select_related('course').all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]


# ─── Study Material views ──────────────────────────────────────────────────────
class StudyMaterialListCreateView(generics.ListCreateAPIView):
    queryset = StudyMaterial.objects.select_related('course').all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]


class StudyMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudyMaterial.objects.select_related('course').all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]
