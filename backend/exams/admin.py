from django.contrib import admin
from .models import ExamSchedule


@admin.register(ExamSchedule)
class ExamScheduleAdmin(admin.ModelAdmin):
    list_display = ['subject', 'exam_type', 'exam_date', 'start_time', 'venue', 'hall_ticket_released']
    list_filter = ['exam_type', 'hall_ticket_released', 'exam_date']
    search_fields = ['subject__name', 'subject__code', 'venue']
