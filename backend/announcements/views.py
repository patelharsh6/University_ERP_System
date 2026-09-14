from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from common.mixins import RoleScopedQuerysetMixin
from common.permissions import ReadOnlyOrFacultyAdmin
from .models import Announcement, Notification
from .serializers import AnnouncementSerializer, NotificationSerializer
from .filters import AnnouncementFilter, NotificationFilter


class AnnouncementListCreateView(generics.ListCreateAPIView):
    """List announcements (filtered by audience) or create announcements (faculty/admin only)."""
    serializer_class = AnnouncementSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]
    filterset_class = AnnouncementFilter
    search_fields = ['title', 'content', 'department']
    ordering_fields = ['is_pinned', 'created_at', 'priority']

    def get_queryset(self):
        user = self.request.user
        qs = Announcement.objects.select_related('author').all()
        if user.role == 'admin':
            return qs
        if user.role == 'student':
            return qs.filter(
                is_active=True
            ).filter(
                Q(target_audience=Announcement.TargetAudience.ALL) |
                Q(target_audience=Announcement.TargetAudience.STUDENTS) |
                Q(target_audience=Announcement.TargetAudience.DEPARTMENT)
            )
        if user.role == 'faculty':
            return qs.filter(
                is_active=True
            ).filter(
                Q(target_audience=Announcement.TargetAudience.ALL) |
                Q(target_audience=Announcement.TargetAudience.FACULTY) |
                Q(target_audience=Announcement.TargetAudience.DEPARTMENT)
            )
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve announcement or modify/delete (faculty/admin only)."""
    queryset = Announcement.objects.select_related('author').all()
    serializer_class = AnnouncementSerializer
    permission_classes = [ReadOnlyOrFacultyAdmin]


class NotificationListView(RoleScopedQuerysetMixin, generics.ListCreateAPIView):
    """List own notifications or create a notification."""
    queryset = Notification.objects.select_related('recipient').all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'recipient'
    faculty_field = 'recipient'
    filterset_class = NotificationFilter
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'is_read']

    def perform_create(self, serializer):
        target = serializer.validated_data.get('recipient', self.request.user)
        serializer.save(recipient=target)


class NotificationDetailView(RoleScopedQuerysetMixin, generics.RetrieveUpdateAPIView):
    """Retrieve or mark own notification as read."""
    queryset = Notification.objects.select_related('recipient').all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    student_field = 'recipient'
    faculty_field = 'recipient'
