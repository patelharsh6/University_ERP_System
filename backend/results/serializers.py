from rest_framework import serializers
from .models import ExamResult


class ExamResultSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    subject_code = serializers.SerializerMethodField()

    class Meta:
        model = ExamResult
        fields = '__all__'
        read_only_fields = ['grade', 'grade_points', 'published_at', 'created_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''

    def get_subject_name(self, obj):
        return obj.subject.name if obj.subject else ''

    def get_subject_code(self, obj):
        return obj.subject.code if obj.subject else ''
