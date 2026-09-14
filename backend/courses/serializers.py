from rest_framework import serializers
from .models import (
    AcademicTerm, Subject, Course, Enrollment, Assignment,
    AssignmentSubmission, StudyMaterial
)


class AcademicTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicTerm
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() if obj.instructor else None

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['enrolled_date']

    def get_course_title(self, obj):
        return obj.course.title if obj.course else ''

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''


class AssignmentSerializer(serializers.ModelSerializer):
    course_code = serializers.SerializerMethodField()
    submission_count = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = '__all__'

    def get_course_code(self, obj):
        return obj.course.code if obj.course else ''

    def get_submission_count(self, obj):
        return obj.submissions.count()


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    assignment_title = serializers.SerializerMethodField()
    course_code = serializers.SerializerMethodField()
    graded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = AssignmentSubmission
        fields = '__all__'
        read_only_fields = ['student', 'is_late', 'submitted_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''

    def get_assignment_title(self, obj):
        return obj.assignment.title if obj.assignment else ''

    def get_course_code(self, obj):
        return obj.assignment.course.code if obj.assignment and obj.assignment.course else ''

    def get_graded_by_name(self, obj):
        return obj.graded_by.get_full_name() if obj.graded_by else None

    def validate(self, data):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if user and user.role == 'student':
            # Students cannot grade themselves
            for forbidden_field in ['marks_obtained', 'feedback', 'graded_by', 'graded_at']:
                if forbidden_field in data:
                    data.pop(forbidden_field)
        return data


class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = '__all__'
