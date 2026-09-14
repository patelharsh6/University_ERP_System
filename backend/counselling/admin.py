from django.contrib import admin
from .models import CounsellingSession


@admin.register(CounsellingSession)
class CounsellingSessionAdmin(admin.ModelAdmin):
    list_display = ['student', 'counsellor', 'slot_start', 'slot_end', 'mode', 'status']
    list_filter = ['status', 'mode', 'slot_start']
    search_fields = ['student__username', 'student__first_name', 'counsellor__username', 'student_concern']
