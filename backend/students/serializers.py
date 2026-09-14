from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import StudentProfile, LeaveRequest, ClearanceItem


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = '__all__'

    def get_full_name(self, obj):
        return obj.user.get_full_name() if obj.user else ''


class StudentCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
    )

    class Meta:
        model = StudentProfile
        fields = '__all__'


class LeaveRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    reviewed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ['student', 'reviewed_by', 'created_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''

    def get_reviewed_by_name(self, obj):
        return obj.reviewed_by.get_full_name() if obj.reviewed_by else None

    def validate(self, data):
        start_date = data.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = data.get('end_date', getattr(self.instance, 'end_date', None))
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date cannot be earlier than start date.'
            })
        return data


class ClearanceItemSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    cleared_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ClearanceItem
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''

    def get_cleared_by_name(self, obj):
        return obj.cleared_by.get_full_name() if obj.cleared_by else None
