from django.contrib import admin
from .models import StudentProfile, LeaveRequest


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'course_name', 'semester', 'admission_year', 'is_enrolled']
    list_filter = ['course_name', 'semester', 'admission_year', 'is_enrolled']
    search_fields = ['user__first_name', 'user__last_name', 'user__enrollment_id']


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['student', 'leave_type', 'start_date', 'end_date', 'status']
    list_filter = ['status', 'leave_type']
