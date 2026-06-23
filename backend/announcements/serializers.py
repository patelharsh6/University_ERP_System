from rest_framework import serializers
from .models import Announcement, Notification


class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['author']

    def get_author_name(self, obj):
        return obj.author.get_full_name() if obj.author else None


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['recipient']
