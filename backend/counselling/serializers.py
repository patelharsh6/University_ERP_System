from rest_framework import serializers
from .models import CounsellingSession


class CounsellingSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    counsellor_name = serializers.SerializerMethodField()

    class Meta:
        model = CounsellingSession
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() if obj.student else ''

    def get_counsellor_name(self, obj):
        return obj.counsellor.get_full_name() if obj.counsellor else ''

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None

        # Hide private_notes from students
        if user and user.role == 'student':
            ret.pop('private_notes', None)
        return ret
