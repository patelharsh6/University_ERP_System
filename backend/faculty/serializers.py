from rest_framework import serializers
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import FacultyProfile


class FacultyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = FacultyProfile
        fields = '__all__'

    def get_full_name(self, obj):
        return obj.user.get_full_name() if obj.user else ''


class FacultyCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
    )

    class Meta:
        model = FacultyProfile
        fields = '__all__'
