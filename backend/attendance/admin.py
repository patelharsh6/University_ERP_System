from django.contrib import admin
from .models import AttendanceRecord, Timetable


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'subject', 'date', 'status', 'marked_by']
    list_filter = ['status', 'date', 'subject']
    search_fields = ['student__first_name', 'student__last_name']
    date_hierarchy = 'date'


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ['subject', 'day', 'start_time', 'end_time', 'room', 'instructor']
    list_filter = ['day', 'department', 'semester']
