from rest_framework import serializers
from .models import AttendanceRecord, Timetable


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = '__all__'
        read_only_fields = ['marked_by']

    def get_student_name(self, obj):
        return obj.student.get_full_name()

    def get_subject_name(self, obj):
        return obj.subject.name


class TimetableSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()

    class Meta:
        model = Timetable
        fields = '__all__'

    def get_subject_name(self, obj):
        return obj.subject.name

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() if obj.instructor else None
