from django.contrib import admin
from .models import FacultyProfile


@admin.register(FacultyProfile)
class FacultyProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'department', 'designation', 'joining_date']
    list_filter = ['department', 'designation']
    search_fields = ['user__first_name', 'user__last_name', 'user__employee_id', 'department']
