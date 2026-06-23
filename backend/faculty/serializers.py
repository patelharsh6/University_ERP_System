from rest_framework import serializers
from .models import FacultyProfile
from accounts.serializers import UserSerializer


class FacultyProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = FacultyProfile
        fields = '__all__'

    def get_full_name(self, obj):
        return obj.user.get_full_name()


class FacultyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyProfile
        exclude = ['user']
