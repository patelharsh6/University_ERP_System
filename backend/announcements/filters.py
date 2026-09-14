import django_filters
from .models import Announcement, Notification


class AnnouncementFilter(django_filters.FilterSet):
    class Meta:
        model = Announcement
        fields = ['priority', 'target_audience', 'department', 'is_pinned', 'is_active']


class NotificationFilter(django_filters.FilterSet):
    class Meta:
        model = Notification
        fields = ['notification_type', 'is_read']
