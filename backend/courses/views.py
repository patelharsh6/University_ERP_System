from django.utils import timezone
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin, IsFacultyOrAdmin
from .models import (
    AcademicTerm, Subject, Course, Enrollment, Assignment,
    AssignmentSubmission, StudyMaterial
)
from .serializers import (
    AcademicTermSerializer, SubjectSerializer, CourseSerializer,
    EnrollmentSerializer, AssignmentSerializer, AssignmentSubmissionSerializer,
    StudyMaterialSerializer
)
from .filters import (
    SubjectFilter, CourseFilter, AssignmentFilter,
    AssignmentSubmissionFilter, StudyMaterialFilter
)


# ─── Academic Term views ────────────────────────────────────────────────────────
class AcademicTermListCreateView(generics.ListCreateAPIView):
    """List terms or create term (faculty/admin only)."""
    queryset = AcademicTerm.objects.all()
    serializer_class = AcademicTermSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    search_fields = ['name', 'code']
    ordering_fields = ['start_date', 'is_current']


class AcademicTermDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve or modify term (faculty/admin only)."""
    queryset = AcademicTerm.objects.all()
    serializer_class = AcademicTermSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]


# ─── Subject views ──────────────────────────────────────────────────────────────
class SubjectListCreateView(generics.ListCreateAPIView):
    """List subjects (all auth) or create subjects (faculty/admin only)."""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = SubjectFilter
    search_fields = ['name', 'code', 'department']
    ordering_fields = ['code', 'credits', 'semester']


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve subject (all auth) or modify/delete (faculty/admin only)."""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]


# ─── Course views ───────────────────────────────────────────────────────────────
class CourseListCreateView(generics.ListCreateAPIView):
    """List courses (students see published; faculty/admin see all) or create course."""
    serializer_class = CourseSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = CourseFilter
    search_fields = ['title', 'code', 'department', 'instructor__first_name', 'instructor__last_name']
    ordering_fields = ['created_at', 'code', 'title']

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.select_related('instructor', 'subject').all()
        if user.role == 'student':
            return qs.filter(is_published=True)
        return qs

    def perform_create(self, serializer):
        instructor = serializer.validated_data.get('instructor')
        if not instructor and self.request.user.role == 'faculty':
            serializer.save(instructor=self.request.user)
        else:
            serializer.save()


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve course detail or modify (faculty/admin only)."""
    serializer_class = CourseSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.select_related('instructor', 'subject').all()
        if user.role == 'student':
            return qs.filter(is_published=True)
        return qs


# ─── Enrollment views ──────────────────────────────────────────────────────────
class EnrollmentListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List student enrollments or enroll in a course."""
    queryset = Enrollment.objects.select_related('course', 'student').all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'course__instructor'
    search_fields = ['course__title', 'course__code', 'student__first_name', 'student__last_name']
    ordering_fields = ['enrolled_date', 'progress', 'is_completed']

    def perform_create(self, serializer):
        target_student = serializer.validated_data.get('student')
        if not target_student or self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            serializer.save()


class EnrollmentDetailView(RoleScopedQuerysetMixin, generics.RetrieveDestroyAPIView):
    """Retrieve or drop an enrollment."""
    queryset = Enrollment.objects.select_related('course', 'student').all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'course__instructor'


# ─── Assignment views ──────────────────────────────────────────────────────────
class AssignmentListCreateView(generics.ListCreateAPIView):
    """List assignments (all auth) or create assignments (faculty/admin only)."""
    queryset = Assignment.objects.select_related('course').all()
    serializer_class = AssignmentSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = AssignmentFilter
    search_fields = ['title', 'description', 'course__code', 'course__title']
    ordering_fields = ['due_date', 'created_at', 'max_marks']


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve assignment (all auth) or modify (faculty/admin only)."""
    queryset = Assignment.objects.select_related('course').all()
    serializer_class = AssignmentSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]


# ─── Assignment Submission views ───────────────────────────────────────────────
class AssignmentSubmissionListCreateView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List submissions (scoped to student/instructor) or submit an assignment."""
    queryset = AssignmentSubmission.objects.select_related('assignment', 'student', 'graded_by').all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'assignment__course__instructor'
    filterset_class = AssignmentSubmissionFilter
    search_fields = ['assignment__title', 'student__first_name', 'student__last_name']
    ordering_fields = ['submitted_at', 'marks_obtained', 'status']

    def perform_create(self, serializer):
        serializer.save(student=self.request.user, status=AssignmentSubmission.Status.PENDING)


class AssignmentSubmissionDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or grade a submission."""
    queryset = AssignmentSubmission.objects.select_related('assignment', 'student', 'graded_by').all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'student'
    faculty_field = 'assignment__course__instructor'

    def perform_update(self, serializer):
        user = self.request.user
        if user.role in ('faculty', 'admin'):
            marks = serializer.validated_data.get('marks_obtained')
            if marks is not None:
                serializer.save(
                    graded_by=user,
                    graded_at=timezone.now(),
                    status=AssignmentSubmission.Status.GRADED
                )
            else:
                serializer.save()
        else:
            serializer.save()


# ─── Study Material views ──────────────────────────────────────────────────────
class StudyMaterialListCreateView(generics.ListCreateAPIView):
    """List materials (all auth) or upload materials (faculty/admin only)."""
    queryset = StudyMaterial.objects.select_related('course').all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = StudyMaterialFilter
    search_fields = ['title', 'description', 'course__code']
    ordering_fields = ['uploaded_at', 'material_type']


class StudyMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve material (all auth) or modify (faculty/admin only)."""
    queryset = StudyMaterial.objects.select_related('course').all()
    serializer_class = StudyMaterialSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
