from rest_framework import serializers
from .models import CourseFeedback


class CourseFeedbackSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = CourseFeedback
        fields = '__all__'
        read_only_fields = ['student']

    def get_student_name(self, obj):
        if obj.is_anonymous:
            return 'Anonymous'
        return obj.student.get_full_name()

    def get_course_title(self, obj):
        return obj.course.title
