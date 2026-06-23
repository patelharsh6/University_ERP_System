from rest_framework import serializers
from .models import Subject, Course, Enrollment, Assignment, StudyMaterial


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
        read_only_fields = ['student']

    def get_course_title(self, obj):
        return obj.course.title

    def get_student_name(self, obj):
        return obj.student.get_full_name()


class AssignmentSerializer(serializers.ModelSerializer):
    course_code = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = '__all__'

    def get_course_code(self, obj):
        return obj.course.code


class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = '__all__'
