from rest_framework import serializers
from .models import CourseFeedback


class CourseFeedbackSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = CourseFeedback
        fields = '__all__'
        read_only_fields = ['student', 'created_at']

    def get_student_name(self, obj):
        if obj.is_anonymous:
            return 'Anonymous'
        return obj.student.get_full_name() if obj.student else ''

    def get_course_title(self, obj):
        return obj.course.title if obj.course else ''

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None

        # Redact identity completely when feedback is anonymous or viewed by faculty
        if instance.is_anonymous or (user and getattr(user, 'role', None) == 'faculty'):
            ret['student'] = None
            ret['student_name'] = 'Anonymous'
        return ret
