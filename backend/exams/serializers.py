from rest_framework import serializers
from .models import ExamSchedule


class ExamScheduleSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    subject_code = serializers.SerializerMethodField()

    class Meta:
        model = ExamSchedule
        fields = '__all__'

    def get_subject_name(self, obj):
        return obj.subject.name if obj.subject else ''

    def get_subject_code(self, obj):
        return obj.subject.code if obj.subject else ''
