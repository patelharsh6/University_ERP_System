from rest_framework import serializers
from .models import StudentProfile, LeaveRequest
from accounts.serializers import UserSerializer


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = '__all__'

    def get_full_name(self, obj):
        return obj.user.get_full_name()


class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        exclude = ['user']


class LeaveRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ['student', 'reviewed_by']

    def get_student_name(self, obj):
        return obj.student.get_full_name()
