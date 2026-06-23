from django.contrib import admin
from .models import Announcement, Notification


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'priority', 'target_audience', 'is_pinned', 'is_active', 'created_at']
    list_filter = ['priority', 'target_audience', 'is_pinned', 'is_active']
    search_fields = ['title', 'content']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read']
